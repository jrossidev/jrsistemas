// ===== Bloco 1 do módulo proposta =====
const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR0AAABUCAYAAAC/SuNrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABNCSURBVHhe7V0tcOW2Fi4sLCwsLCx8rJ1p0ldYuCBXXriwsHBZ4MKFhQt33tqZwMDAwsLCwMDAvvn0c6N7rJ+jY9nWTfTNfDO7ubYk20efj46O5K++WhE/Dp+/+XkYf7oYxt8vh/H9pZo+XqrpzueFuvkTv10MX/7Asf8dbr+j5XR0dHREAdHQIgNRGaZ/JbxQ41+X6ub6cph+oOV3dHR0aI8GnsqFmv6mArKYanyAh9Q9oI6Ojq9+HO6+Nl7N+DATi9pU49Olmj5A4Gg7Ojo69sHPw/QrDZnkSMtg43KY3l6o6Z+ZOKxNNT0iBgTBo22qCXhWOg61Mn8ZvvyGWJZjH1J2rAm8tKkNchgbaUAHZn00Q1pGFj8O07c65hIobEtawVutg1oBmNW7FfVQVcfFxvdoC21fR4cE5mU6t7ccYza4uuigk+/i3cSoxid4CrSdNbC36FDq+66mD7E3TkcHB2clOujcOq4SKIRFE5Nx4zpMnX94/v/SmND4nrZ3KVoTnSP1fby57rGtDgnORnRMns385CTV9Hihpk+Xw/iGG3+xQamPEhFCXdx6OGhWdBzNPVpteNnxMnEWogPRoCelaOI94xtaTikuhv/950JNn2n5SarpIy1HiuZFB1TTI4Satr2jI4bmRQcdnzukMrGe5WJDYdrATzSEV0bLkOAsRAc0z6d7PB0sNC06unHsYc76U9ja49LT5bTuOWu8/c9GdEA13dP2d3SE0Kzo6KQ/zrS4fsvW925i+GX48j1r9kxNjziWnl+CsxId7eF9eUevoaODolnR0TNLgYNPuFMgUyc3MYZbEE16bgnOTXS6t9PBQW3RqZKRDCHJxnHU9Lhnvgg8sUs13s7aNedbei4XZyc6w/Rvn0bvyKG26FRBdsZIjU+rNoAJvcg0t8BUjQ/SWJNYdLSXOE8jD1GnFDznKqWFnkexyHa8DjQnOnqmKFDhKbeL4eRggt3p4LJ0NksqOlIP0K7Uf8eKpUVZP0my42WhPdHJGXzFPJhayIqDGp+wXoyel0O23AilouNgho7TPS2XQ2yIRsurAQTlcT8oJfd1T+DZ0GvAi5YetwUQxqBt2aJdTYkOCqUVnVDYebdAdkgo8ACy9yPCpaIDmGB5+XAL94GWVQo8Y7ODwM2f3JQJszj15rpGR0H9tAPmGLNLs/UKvMfsMPwJMUJ4xbGylsIsI7I7Z9L6U8QLCOcVZPanUFt0JM/reLLdqW9WmaN0mLIFdPA70OYjBTM7uDmzchisITpAsXGCaryl5XChr1dSJ6UaH7Chm7SDSKZgaSzLeotY25ccegd53LdpufiYHRkg3oJ2hKjGJ8QBYwLAQW3RkTyv48nJ/JcFAVm8/ajSpSidhjd7LQfablkqBg2ITj5tgVIw/K0mNpTGSyoObEuM2K+Hm1KRI/qDNNfruGeNwFvlEl6tRBibER3cXPqDT7y5aGUc2C1MsSXDbK4+TtnsGOMaipLn9had/JAxxLJhZM67rUI13ZVM5UuM2IlO9b2ejIdS9BK0Cazp4Vwlom+V2lszogNxoD/4LL0wwMQFpn9K1VhfhBofJHUmH3bh0GNv0eHGUwhZnoXJOMcOALPzVyGEgGsHEiN2113Dw6E0Nszz8m3cps5QislS4WlGdFKzJejItKIcbJaieCmCDbjdcx+2g8l/mV+Dpg6E88vbU3RkW4nwAv1LZseWkNs5JEZszkk8+4XkzAqWLI6uzZLs+4ZEJ/VW5bnsJzEhPUSSL7p0HcN8isYMuzgGm8szKhHBvUQHw0BaJotq+kDLCmFLD4fSeDxp4ZcYcS6eV4Op52oTVeMx0Q3InehpR3QCPzjGKqPQMYija8kTqhT8GA2MlSsYKQHlXguwlei4HBg95bzMcLOxB5EHVZsZcZQY8SZMtHsL0cuSOdnThOjkGlHSida6+Zyb6ZAJJLJiHoBUdPZhXuSruP/mG2SLYxYxAwYkRrwJ1fRI2wrovKal97USOfuF5/p7jLFnJnle2SEJt8ObALD5esGROlei8IGYRCh/fdLnkqS3VDCxZBbufEQnLziAbDbMeJlITPNfPuhoMPBk4D7BVAxCYsRbMeRtS2NJ1qvFtR49VGNz2DeKtZh5zoQ35tCE6OiIe+AHzYi6h+AEZ/b3kocSmGHCReEB0b/HkPS2GA/FoXnRwR7UzHF8NnkyRr0BfPylY2Jvsmn3mkYcov2Ej87ktcQLTCSSz5yvO5SUyQtMl8f2UmLu0ITopC6upLNDdMwDGN+ggY5FSW5quvPPdXt1lLUj3gk4D9uhWdE5Zszyc18kXg5X0ABR+RHvVWLElLGcrCUiqUleWro8ekyGJTYo8XhoGRRNiE7qpLLOHh/WLGVhO6IiV/LAWxUdXAPEOOWB+JAYWUluCqDrKB1GR+KFKXvMUm9UH+4cPiQiCVL7kXiQJbO6RaMEy9A99SGxBzB2XyXPK3sSrSSGVkQnOSWsbq7p8TG0KjpH6jVOeW8k93zDnA8jckgOa+OcBfZl7Y2XF4JELEDqnZkZ1vk+SSmWeKhCryw5i9mE6OQ6F/cmtSI6qXa8yEByZpmBRAxS5cUgMT7qOUjLMWXl4xk+ROkJoa02V4LZwbN8pjAmDg5NiE5O9UMR+xBSnX0pS0QnY0ysNyFwNqIDJrK3M/djRkkGOiAx5tBzlRgxGOsUMYjsdQPRMUPVm2vJcBXM3QfJc0qVK3le2WAYZ+4fED1EJkPGGYIJFMYfFvdagLMSnYjXYPfGmR2bop0MmA0LWEzc+xjp0g2JEZtyyrwziQe4hujYIRo+r4StOBYvT4mJg0MTogOkEupCxhxCSHToMVzQsriio2e7AtfgMTne9XFuomN5cn25HKxGeNJmiREjvuWXwcEeogObsjsvYG/sxQITYkwcHBoSncQDEDzQvZC+Dn7OESAXndOUAQ5NrhTySBLtZ5AGOhkivDupMUuMWCIGontdWI/JAsdQaR2BCZHeT4pmRCd3YqzC1pBad4W3Cz0+BVwzLYPD3JRlDjg/OQOX59FzyD3XNng6UyZqc6EYAGuJjt1EDJn4UVtck7m+2ozomJ3O5j8eWZDJuxcYIsEOIgOM8oJcKjoOksQw0BfX3D5JjfDkuUiMmCMGFGuIjklm3UdsHGPi4NCM6OiTAzGZI5l7teyJnAtbKgZ7i45ZSFg+ZerHv0yAd35MY3wRomOWXATO2ZgxcXBoS3RyJwv2390KyfVjBYFoH3uLDiDNnHXT56klLg3x7EVnFXHHC0fgNcXEwaEp0bHTzbmLZM/+bInU7BtYkhTo0ILopJZ0ZKifk8QgduBZi07uhVdCvBxtu96ajcHK2xgTB4emRAfIxgACN31vZDemEg4NWxCd7LVF6PKRJLNXMHxc+1akz0ZixBK7lHToUD2MF3WUvsiE7EbSRtxTWo6P5kTHbkiUvokNBZVxI/IJafPtNjjQZc/KyjNkPFJIPZ1n0RFcQ+Fe0rUhMeKQGOQg6dC0HrGXo6Z7zsJPSRtj4uDQnOgAnDhAbOuALaFvXibQWrpa2oeow1YWndywMUE9vJIa2J7DaIkRUzHgQNKhaT2imFvBomNJ+TFxcJDaRKxcyfOiZWhkjX3hxutLYTfCzm6eVLLsgWJv0ZEMjRz9IUvp2iuQs3p9LUiMmIoBBzVEJ+9l0/Pnm9SlkO2HAcbEwaFd0eGkz+sbXr4FwlLgLczpSDQ7txR7io5ej5Px4lL0y5J1rrLOAeBF4OI0XIY8KokRUzHgQHZfnuuRrGsr7S/FopYQB4dmRQdgP5QCd3Ep2B8zU+PT0s6/h+jYISO++ZW/xgjpKnGJUYClXiLbXnwG4oOi9u4gOqwXMyHOOW1FHJLywZg4ODQtOqygsqX0u8pcmJXw/FyIGsMDqeiY4G9gBXaKyD7OJDdySdMDpEYG8eLGw6QB1VAnlBjxHqJj9l0OHJMk39NBXfPz84yJg4PUHmLlSp4XLeMERTdWsHcvB3ramCl+ph3lBhiCWHR2Zkj8JQFJTb1Pz7w8H9roBMOAWMKmxIglz3yp6IiEljlsLep3hDFxcGhedIDixYc6k/Lmmrv5VwgwdMyQcWI3tO5cJ+HiHEUnFsdadC36qxNf3lGjs5+gkYlZYgZUYsR7iI70nlJP1MfijeMT4uBwFqJTMsyiNJ8BublGg3MeEI4xXo18mFEah0hBalS7Uc8ohg0DkMyErMXU1qISI95DdGSBZFfOeItnZQXgh3qfyImLg8NZiA6wZPp2Ru0Jme+TS8UsRBgRbfcSnJvo5OJYLV1PKJbjIDHiPUTHlFHoiW/AmDg4nI3oAKKHtBGXJAHG0FInzTE2rKKQLquoydTwApAYMRUDDkT2TOqRZoyvzOQWLmclOujULSo7uEai4tmIjhpvSwR3SRxmKTniKDFiKgYc1BAdk+JQHkRnU1b2yxEdQJo7sCZLdwTkonnRMbk8SQMLwb48Nhcek1aRF0eJEVMx4KCG6ACreTs26780BJELM5yd6AAl+TKrs+JsFUXLolMjLyq7o0BNFuzFJDHikBjkUEt07JYwol0eo/SWGRW/INT4kJq0OUvRMTdZPsNUk7Fp1xpoTXTM0HZ8vyTjmQLXWGPGJEo1PpTOKEqMOCQGOdQSHaCq96jGB7+Di+Jw+gOM4ZfSWYoOYNYGicab9RgxgFrYU3RMqgFm93S+028xA6oF68bXe1vrIQE+oZsfTlFIjFhiCzVFxwH3cVFqgrq5pl6K2A4jbT1b0QE2dc8p1fi0JPmQA/NwAksW6nH2qRrahq2Be2qTMj+VxhJwPM4r9WwobN4KvVcZlse23Gd/ysirx348jzcaUNMdvJmYBwvhpnbyTKSy0Dam22o+wkCPzTPWPsnzomUUgX1jq3NhwztYgAjljBudN2aQHc+r748JgMOXP5xorO3BvkjsMcwqWYjY0dHxAmHeeHNxWIstDEM6Ojp2hIncLwieFTCXg9DR0fFKYIJJc5Goykz+QW0Mw/Dd4XB4H+DvwzD8ZHkyzMPfAscHifLJ8X/Q8q6urt769V5dXf1Gy4kR5/plhUDKSy5PiAHX4Zdj70vyOXHqjV0rrsvWEV2/1fFKsFpm5pH8DZBqAIatlPqXwY9OLNApAr8H6QTH/xvtgEqpO++3f5RSf9JyEgxOmfo4HA4P/jlXV1fs5SQQllh7UG5K9AL1zma8YmWTeh4hxvTcjlcCm5lZNs3KJXPzo5ooEB1QL8WgIpJiRHSe4Dm4NqwpOujogXOya6OAYRi+PRwOfwfOP2FIECBs9LhQvSXXGqqn45VAtJtajhX2O5agRHSsWHxNRSTFkOhYHgV2TdFBR6fn2OvITuPCu6PnhmjLOxlqheoFab0l13o4HKL783S8AlRLB7fMbYWwFqjoQCC83zC0OAqC7TQzEUkNMQB6vHeeHm5Q0QmcDyE6nkd/jwEdnNbp1ZO838Mw/ECOf3DxlWEYvqcekO+FWA/pidZpjzvJvaKig/vrlYN42yP5PRlH6njBMDsNyr9m4DO1w9zaSIkOQEUHw4aAiHymgVDQiVHgeFcXOvLXa4lOrN5YPT4gIuT4k6HN1dXVG/v3e6XUB18s6LmknAe/nIzofBMQnayH1vGCwflKKJOz7yJtBSo6KbphRKozE+qhT+b4DyuKzvE863nc+uWkAsq2XcdjfTEAIJZ0Fs7B94Ii9R4DylR0UuzDqw6NxUskAt9E2hIlopPzXALkiI5++3v/riI6gUDu50BQeRbYdaBCwZ26xnG0jlS9XNGBx8NtQ8cLh87dkS6R0Dk5+y514IoOGT4kRcRjTHSiAdpaokMDuSjDDoX8v0UDypip848NeTqRKfCTawvVa8vT9XJEB55TrJ0drxTSz2ksXalcAwHRQSe4DgRCj184pSJSGki2gdi/aOcCa4hOKpBLGQso4+/+cYjh+L+7+2brgTfzq53Z49arY2dUdGy9J4IHhgSu4xVDsq/yWtuPloKKjusMoWCoe9tTERGIjs5SpuXb+heLDhWMFEP1AS5Q7B1378dw6PDLZlK/peXH6ALKVHTcPQ54ahhedW+n4xlFn69ZcfvRUtDO70QHoDNX6KChPB0bOMWxM7olDqRj6Xwk2uFcHScNlInOyfF2eHNsE50RigWUqTdmy4UXSMvXwzQ6jArUO8tQpvfAiY4t7+R4P7epo0ODu0vbmtuPliIlOjZPhA4XPlARSRHH0uOd6NiOdSIAS0UncD2h8qgXFwwo07ISxBKR73P1BjwheDNB0bHHn3hbIB3mdbxysL4SqqZ7et6eoB3LFx3gcDi8o4ZPhxYppkQnVH6os5aIDo2H0OsBaMwnFVC2eUnU4/CpN2OHB8SoNxTzobNkJwHrwPUgtynY1o5XiuReqmaWa7ecnBBs5u3JcIgeY9/Gs6EThyjPvuGPf6OdxnYs9/ss1kV+jy57sImG6MR+XcGlJVYk/HZGA7VWpCCct+j0dtj0CffOHUPbGKvXljO7T955J/Zhs6pPrglC7R/T0YHcnbuZ4GjRuTnOAHV0dHRUQ2h70zU+CdzR0dFxBB1mrfFJ4I6Ojo4T4IuPxsvp2492dHRsAGw7ar7q0EZOTkdHx3b4P6ezkbNYTEs3AAAAAElFTkSuQmCC";

        // Carrega a logo ao iniciar a página
        window.onload = function() {
            document.getElementById('header-logo').src = logoBase64;
        };

        // Preenche a data de hoje em português ao carregar
        (function() {
            const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                           'julho','agosto','setembro','outubro','novembro','dezembro'];
            const hoje = new Date();
            const texto = hoje.getDate() + ' de ' + meses[hoje.getMonth()] + ' de ' + hoje.getFullYear();
            document.getElementById('data-proposta').textContent = texto;
        })();

        function addVehicleRow() {
            const tbody = document.getElementById("vehicle-table-body");
            const row = tbody.insertRow();
            row.innerHTML = `
                <td class="model-cell"><span contenteditable="true">Novo Modelo</span></td>
                <td class="grupo-12m td-valor-group"><span class="check-valor-12m" contenteditable="true">R$ 0,00</span></td>
                <td class="grupo-12m"><span contenteditable="true">0,00</span></td>
                <td class="grupo-18m td-valor-group"><span class="check-valor-18m" contenteditable="true">R$ 0,00</span></td>
                <td class="grupo-18m"><span contenteditable="true">0,00</span></td>
                <td class="grupo-24m td-valor-group"><span class="check-valor-24m" contenteditable="true">R$ 0,00</span></td>
                <td class="grupo-24m"><span contenteditable="true">0,00</span></td>
                <td class="no-print"><button class="btn-remove" onclick="removeRow(this)">X</button></td>
            `;
        }

        function removeRow(btn) {
            if (confirm("Tem certeza que deseja remover esta linha?")) {
                btn.closest("tr").remove();
            }
        }

        function toggleAdditionalConditions() {
            const el = document.getElementById("additional-conditions-section");
            el.style.display = (el.style.display === "none") ? "block" : "none";
        }

        function isGroupEmpty(classeValor) {
            const vazios = ["R$ 0,00", "0", "0,00", ""];
            const elementos = document.querySelectorAll(classeValor);
            for (const el of elementos) {
                const texto = el.innerText.trim();
                if (texto && !vazios.includes(texto)) return false;
            }
            return true;
        }

        function removerElementos(seletor) {
            const removidos = [];
            document.querySelectorAll(seletor).forEach(el => {
                const ref = { el, parentNode: el.parentNode, nextSibling: el.nextSibling };
                el.parentNode.removeChild(el);
                removidos.push(ref);
            });
            return removidos;
        }

        function restaurarElementos(removidos) {
            removidos.slice().reverse().forEach(({ el, parentNode, nextSibling }) => {
                parentNode.insertBefore(el, nextSibling);
            });
        }

        function downloadPDF() {
            const btnDownload = document.getElementById("btn-download");
            btnDownload.innerHTML = "⏳ Gerando...";
            btnDownload.disabled = true;

            // 1. Remover colunas de período vazias do DOM
            const colunasRemovidas = [];
            [
                { valor: ".check-valor-12m", seletor: ".grupo-12m" },
                { valor: ".check-valor-18m", seletor: ".grupo-18m" },
                { valor: ".check-valor-24m", seletor: ".grupo-24m" },
            ].forEach(({ valor, seletor }) => {
                if (isGroupEmpty(valor)) {
                    colunasRemovidas.push(...removerElementos(seletor));
                }
            });

            // 2. Remover a coluna do botão X do DOM (evita espaço em branco no PDF)
            const colunaBtnRemovida = removerElementos("table .no-print");

            // 3. Ocultar demais elementos no-print (barra de botões, botão adicionar)
            const noPrintEls = document.querySelectorAll(".no-print");
            noPrintEls.forEach(el => el.style.visibility = "hidden");

            // 4. Gerar PDF
            const element = document.querySelector(".container");
            const opt = {
                margin:      [0.4, 0.3],
                filename:    "Proposta_Benali.pdf",
                image:       { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0, logging: false },
                jsPDF:       { unit: "in", format: "a4", orientation: "portrait" },
                pagebreak:   { mode: ["css", "legacy"] }
            };

            const restaurar = () => {
                restaurarElementos(colunasRemovidas);
                restaurarElementos(colunaBtnRemovida);
                noPrintEls.forEach(el => el.style.visibility = "");
                btnDownload.innerHTML = "⬇️ Baixar PDF";
                btnDownload.disabled = false;
            };

            html2pdf().set(opt).from(element).save().then(restaurar).catch(restaurar);
        }
