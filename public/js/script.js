document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("nav-toggle");

  if (toggle) {
    toggle.addEventListener("change", function () {
      var nav = document.getElementById("nav-menu");
      if (nav) {
        nav.style.display = this.checked ? "block" : "none";
      }
    });
  }
});
