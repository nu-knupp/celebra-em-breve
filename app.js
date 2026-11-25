// Celebraverso — página "Em breve": calendário da campanha, prévia por URL e
// troca entre os dois desenhos renderizados do app (com/sem campanha).
// A faixa "Black Friday: crie seu convite…" não existe nesta página.
(function () {
  "use strict";

  var root = document.documentElement;
  var CAMPAIGN = "black-friday";

  /* 4ª sexta de novembro; âncora −7 a âncora +3, em America/Sao_Paulo. */
  function nthWeekdayISO(year, month, weekday, n) {
    var first = new Date(Date.UTC(year, month - 1, 1));
    var offset = (weekday - first.getUTCDay() + 7) % 7;
    return new Date(Date.UTC(year, month - 1, 1 + offset + (n - 1) * 7))
      .toISOString()
      .slice(0, 10);
  }

  function addDays(iso, days) {
    var parts = iso.split("-").map(Number);
    return new Date(
      Date.UTC(parts[0], parts[1] - 1, parts[2]) + days * 86400000,
    )
      .toISOString()
      .slice(0, 10);
  }

  function todayISO() {
    var parts = { year: "", month: "", day: "" };
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .forEach(function (part) {
        if (Object.prototype.hasOwnProperty.call(parts, part.type)) {
          parts[part.type] = part.value;
        }
      });
    return parts.year + "-" + parts.month + "-" + parts.day;
  }

  function isScheduled(today) {
    var anchor = nthWeekdayISO(Number(today.slice(0, 4)), 11, 5, 4);
    return today >= addDays(anchor, -7) && today <= addDays(anchor, 3);
  }

  /* ?tema=black-friday / ?tema=off / ?tema=padrao / ?tema=auto (padrão da aba). */
  function preview() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get("tema");
      if (fromUrl === "off" || fromUrl === "padrao") {
        sessionStorage.setItem("celebra:tema", "off");
        return "off";
      }
      if (fromUrl === CAMPAIGN) {
        sessionStorage.setItem("celebra:tema", CAMPAIGN);
        return CAMPAIGN;
      }
      if (fromUrl === "auto") {
        sessionStorage.removeItem("celebra:tema");
        return null;
      }
      if (fromUrl) {
        sessionStorage.removeItem("celebra:tema");
        return null;
      }
      var saved = sessionStorage.getItem("celebra:tema");
      if (saved === "off") return "off";
      if (saved === CAMPAIGN) return CAMPAIGN;
    } catch (error) {
      /* Sem armazenamento, a URL ainda vale. */
    }
    return null;
  }

  var today = todayISO();
  var chosen = preview();
  var active =
    chosen === CAMPAIGN ? true : chosen === "off" ? false : isScheduled(today);

  if (active) {
    root.setAttribute("data-campaign", CAMPAIGN);
    root.style.setProperty("--hero-top", "#0e0a24");
    root.style.setProperty("--hero-glow-a", "255 201 51 / 0.5");
    root.style.setProperty("--hero-glow-b", "255 79 154 / 0.5");
  } else {
    root.removeAttribute("data-campaign");
    root.style.removeProperty("--hero-top");
    root.style.removeProperty("--hero-glow-a");
    root.style.removeProperty("--hero-glow-b");
  }

  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", active ? "#0e0a24" : "#1b1040");

  /* O HTML padrão é o desenho com campanha; sem campanha, troca pelo clone. */
  if (!active) {
    var atual = document.getElementById("pagina-black");
    var modelo = document.getElementById("pagina-off");
    if (atual && modelo) {
      var troca = document.createElement("div");
      troca.id = "pagina-black";
      troca.appendChild(modelo.content.cloneNode(true));
      atual.replaceWith(troca);
    }
  }

  var ano = String(new Date().getFullYear());
  document.querySelectorAll("footer p").forEach(function (p) {
    if (/©\s*\d{4}/.test(p.textContent)) {
      p.textContent = p.textContent.replace(/©\s*\d{4}/, "© " + ano);
    }
  });
})();
