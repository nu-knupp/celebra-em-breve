// Celebra — mínimos do "Em breve": só o ano do rodapé.
(function () {
  var year = document.getElementById("ano");
  if (year) year.textContent = String(new Date().getFullYear());
})();
