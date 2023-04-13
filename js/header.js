var hideNav = document.querySelector(".hide-nav");
var navegacao = document.querySelector(".navegacao");

hideNav.addEventListener("click", () => {
    navegacao.classList.toggle("show-nav");
    hideNav.classList.toggle("show-nav");
});