// Celebraverso — página "Em breve": só atualiza o ano do rodapé (sem campanha).
(function () {
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
