// Celebraverso — página "Em breve": só atualiza o ano do rodapé (sem campanha).
(function () {
  var ano = String(new Date().getFullYear());
  document.querySelectorAll("footer p").forEach(function (p) {
    if (/©s*d{4}/.test(p.textContent)) {
      p.innerHTML = p.innerHTML.replace(/20d{2}/, ano);
    }
  });
})();
