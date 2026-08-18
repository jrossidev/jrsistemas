import json
import os
import queue
import shutil
import sqlite3
import threading
import time
import sys
import uuid
from datetime import datetime

# Garante suporte a UTF-8 no console Windows sem erros de codec
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Diretórios base
BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BACKEND_DIR, 'data')
STORAGE_DIR = os.path.join(BACKEND_DIR, 'storage')
DOWNLOADS_DIR = os.path.join(STORAGE_DIR, 'downloads')
DB_PATH = os.path.join(DATA_DIR, 'tasks.db')

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# Lock para sincronização de gravação no SQLite
_db_lock = threading.Lock()

# Filas de tarefas categorizadas para controle rigoroso de concorrência
# Cada fila possui um worker dedicado (1 tarefa por vez por serviço externo)
queue_totaltrac = queue.Queue()
queue_detran = queue.Queue()


def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn


def init_db():
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                params_json TEXT,
                progress_pct INTEGER DEFAULT 0,
                progress_msg TEXT DEFAULT '',
                result_json TEXT,
                artifact_path TEXT,
                created_at TEXT NOT NULL,
                started_at TEXT,
                completed_at TEXT,
                logs TEXT DEFAULT ''
            );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type, created_at DESC);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);")
        conn.commit()
        conn.close()


def row_to_dict(row):
    if not row:
        return None
    d = dict(row)
    if d.get('params_json'):
        try:
            d['params'] = json.loads(d['params_json'])
        except Exception:
            d['params'] = {}
    else:
        d['params'] = {}

    if d.get('result_json'):
        try:
            d['result'] = json.loads(d['result_json'])
        except Exception:
            d['result'] = {}
    else:
        d['result'] = {}

    # Lista de logs linha por linha para fácil consumo no frontend
    raw_logs = d.get('logs') or ''
    d['logs_list'] = [line for line in raw_logs.split('\n') if line]
    return d


def create_task(task_type, params=None):
    task_id = f"{task_type[:4]}_{uuid.uuid4().hex[:10]}"
    now = datetime.now().isoformat()
    params_str = json.dumps(params or {})

    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO tasks (id, type, status, params_json, progress_pct, progress_msg, created_at, logs)
            VALUES (?, ?, 'PENDING', ?, 0, 'Aguardando na fila de execução...', ?, '')
        """, (task_id, task_type, params_str, now))
        conn.commit()
        conn.close()

    return task_id


def get_task(task_id):
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()
        conn.close()
    return row_to_dict(row)


def get_latest_task(task_type=None):
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        if task_type:
            cursor.execute("SELECT * FROM tasks WHERE type = ? ORDER BY created_at DESC LIMIT 1", (task_type,))
        else:
            cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC LIMIT 1")
        row = cursor.fetchone()
        conn.close()
    return row_to_dict(row)


def list_tasks(task_type=None, limit=20):
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        if task_type:
            cursor.execute("SELECT * FROM tasks WHERE type = ? ORDER BY created_at DESC LIMIT ?", (task_type, limit))
        else:
            cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
    return [row_to_dict(r) for r in rows]


def update_task_progress(task_id, pct, msg, log_line=None):
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        if log_line:
            timestamp = datetime.now().strftime('%H:%M:%S')
            formatted_line = f"[{timestamp}] {log_line}"
            cursor.execute("""
                UPDATE tasks
                SET progress_pct = ?,
                    progress_msg = ?,
                    logs = CASE WHEN logs = '' THEN ? ELSE logs || CHAR(10) || ? END
                WHERE id = ?
            """, (pct, msg, formatted_line, formatted_line, task_id))
        else:
            cursor.execute("""
                UPDATE tasks
                SET progress_pct = ?,
                    progress_msg = ?
                WHERE id = ?
            """, (pct, msg, task_id))
        conn.commit()
        conn.close()


def set_task_running(task_id, msg='Iniciando automação...'):
    now = datetime.now().isoformat()
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime('%H:%M:%S')
        formatted_line = f"[{timestamp}] Tarefa iniciada."
        cursor.execute("""
            UPDATE tasks
            SET status = 'RUNNING',
                started_at = ?,
                progress_pct = 5,
                progress_msg = ?,
                logs = CASE WHEN logs = '' THEN ? ELSE logs || CHAR(10) || ? END
            WHERE id = ?
        """, (now, msg, formatted_line, formatted_line, task_id))
        conn.commit()
        conn.close()


def set_task_completed(task_id, msg='Concluído com sucesso!', result=None, artifact_path=None):
    now = datetime.now().isoformat()
    result_str = json.dumps(result or {})
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime('%H:%M:%S')
        formatted_line = f"[{timestamp}] ✅ {msg}"
        cursor.execute("""
            UPDATE tasks
            SET status = 'COMPLETED',
                completed_at = ?,
                progress_pct = 100,
                progress_msg = ?,
                result_json = ?,
                artifact_path = ?,
                logs = logs || CHAR(10) || ?
            WHERE id = ?
        """, (now, msg, result_str, artifact_path, formatted_line, task_id))
        conn.commit()
        conn.close()


def set_task_failed(task_id, error_msg, log_line=None):
    now = datetime.now().isoformat()
    with _db_lock:
        conn = get_db()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime('%H:%M:%S')
        formatted_line = f"[{timestamp}] ❌ {error_msg}"
        if log_line:
            formatted_line += f"\n[{timestamp}] Detalhes: {log_line}"

        cursor.execute("""
            UPDATE tasks
            SET status = 'FAILED',
                completed_at = ?,
                progress_msg = ?,
                logs = logs || CHAR(10) || ?
            WHERE id = ?
        """, (now, error_msg, formatted_line, task_id))
        conn.commit()
        conn.close()


def save_task_artifact(task_id, source_file_path, filename_suffix='crlv.pdf'):
    """Salva um arquivo gerado (como PDF do CRLV) na pasta permanente de storage."""
    if not source_file_path or not os.path.isfile(source_file_path):
        return None

    dest_filename = f"{task_id}_{filename_suffix}"
    dest_path = os.path.join(DOWNLOADS_DIR, dest_filename)
    shutil.copy2(source_file_path, dest_path)
    return dest_path


# ── WORKERS EM BACKGROUND ──────────────────────────────────────────

def _worker_loop(task_queue, worker_name):
    print(f"👷 Worker '{worker_name}' iniciado e aguardando tarefas...")
    while True:
        try:
            item = task_queue.get()
            if item is None:
                break

            task_id, func, args, kwargs = item
            set_task_running(task_id)

            try:
                func(task_id, *args, **kwargs)
            except Exception as e:
                print(f"🔥 Erro no worker '{worker_name}' processando tarefa {task_id}: {e}")
                set_task_failed(task_id, f"Erro na execução da tarefa: {e}")
            finally:
                task_queue.task_done()
        except Exception as e:
            print(f"🔥 Erro inesperado no loop do worker '{worker_name}': {e}")
            time.sleep(1)


def enqueue_task(task_type, target_func, args=(), kwargs=None, params=None):
    """Cria a tarefa no banco e a despacha para a fila correspondente."""
    kwargs = kwargs or {}
    task_id = create_task(task_type, params=params)

    if task_type in ('vex_sync', 'lote_manual'):
        queue_totaltrac.put((task_id, target_func, args, kwargs))
    elif task_type == 'crlv_detran':
        queue_detran.put((task_id, target_func, args, kwargs))
    else:
        # Fallback genérico
        queue_totaltrac.put((task_id, target_func, args, kwargs))

    return task_id


def start_workers():
    """Inicia as threads dos workers de background."""
    init_db()

    thread_totaltrac = threading.Thread(
        target=_worker_loop,
        args=(queue_totaltrac, 'TotalTrac_Worker'),
        daemon=True,
        name='Worker_TotalTrac'
    )
    thread_totaltrac.start()

    thread_detran = threading.Thread(
        target=_worker_loop,
        args=(queue_detran, 'Detran_Worker'),
        daemon=True,
        name='Worker_Detran'
    )
    thread_detran.start()
