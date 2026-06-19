(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-menu-panel]");
        var search = document.querySelector(".header-search");

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
                if (search) {
                    search.classList.toggle("is-open");
                }
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function start() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            if (slides.length > 1) {
                start();
            }
        }

        var filter = document.querySelector("[data-card-filter]");
        if (filter) {
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
            filter.addEventListener("input", function () {
                var value = filter.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var source = card.getAttribute("data-card-text") || card.textContent.toLowerCase();
                    card.style.display = !value || source.indexOf(value) !== -1 ? "" : "none";
                });
            });
        }
    });
})();
