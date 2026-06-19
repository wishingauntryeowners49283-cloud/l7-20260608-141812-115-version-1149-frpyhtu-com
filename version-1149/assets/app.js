(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var mobileButton = document.querySelector("[data-mobile-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (mobileButton && mobileNav) {
            mobileButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var searchToggle = document.querySelector("[data-toggle-search]");
        var headerSearch = document.querySelector("[data-header-search]");
        if (searchToggle && headerSearch) {
            searchToggle.addEventListener("click", function () {
                headerSearch.classList.toggle("is-open");
                var input = headerSearch.querySelector("input");
                if (input) {
                    input.focus();
                }
            });
        }

        var carousel = document.querySelector("[data-hero-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
            var next = carousel.querySelector("[data-hero-next]");
            var prev = carousel.querySelector("[data-hero-prev]");
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                    start();
                });
            }
            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                    start();
                });
            }
            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(parseInt(dot.getAttribute("data-hero-dot"), 10) || 0);
                    start();
                });
            });
            carousel.addEventListener("mouseenter", stop);
            carousel.addEventListener("mouseleave", start);
            start();
        }

        var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
        var inputs = Array.prototype.slice.call(document.querySelectorAll(".site-search"));
        var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
        var activeFilter = { field: "all", value: "" };

        function currentQuery() {
            var value = "";
            inputs.forEach(function (input) {
                if (input.value.trim()) {
                    value = input.value.trim().toLowerCase();
                }
            });
            return value;
        }

        function applyFilter() {
            var query = currentQuery();
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var matchesText = !query || text.indexOf(query) !== -1;
                var matchesChip = true;
                if (activeFilter.field !== "all" && activeFilter.value) {
                    var fieldValue = (card.getAttribute("data-" + activeFilter.field) || "").toLowerCase();
                    matchesChip = fieldValue.indexOf(activeFilter.value.toLowerCase()) !== -1;
                }
                var isVisible = matchesText && matchesChip;
                card.classList.toggle("is-hidden", !isVisible);
                if (isVisible) {
                    visible += 1;
                }
            });
            document.querySelectorAll("[data-empty-state]").forEach(function (node) {
                node.classList.toggle("is-visible", visible === 0 && cards.length > 0);
            });
        }

        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                inputs.forEach(function (other) {
                    if (other !== input) {
                        other.value = input.value;
                    }
                });
                applyFilter();
            });
        });

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                chip.classList.add("is-active");
                activeFilter = {
                    field: chip.getAttribute("data-filter") || "all",
                    value: chip.getAttribute("data-value") || ""
                };
                applyFilter();
            });
        });
    });
})();
