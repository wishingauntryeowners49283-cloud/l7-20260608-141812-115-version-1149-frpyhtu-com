(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length > 1) {
            var current = 0;
            var showSlide = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                });
            });
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var cardList = document.querySelector("[data-card-list]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var queryInput = document.querySelector("[data-filter-input]");
        var yearSelect = document.querySelector("[data-filter-year]");
        var genreSelect = document.querySelector("[data-filter-genre]");
        var categorySelect = document.querySelector("[data-filter-category]");
        var sortSelect = document.querySelector("[data-sort-cards]");

        if (queryInput) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q) {
                queryInput.value = q;
            }
        }

        function applyFilters() {
            var q = normalize(queryInput && queryInput.value);
            var year = yearSelect ? yearSelect.value : "";
            var genre = normalize(genreSelect && genreSelect.value);
            var category = categorySelect ? categorySelect.value : "";
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.tags
                ].join(" "));
                var ok = true;
                if (q && haystack.indexOf(q) === -1) {
                    ok = false;
                }
                if (year && card.dataset.year !== year) {
                    ok = false;
                }
                if (genre && normalize(card.dataset.genre).indexOf(genre) === -1 && normalize(card.dataset.tags).indexOf(genre) === -1) {
                    ok = false;
                }
                if (category && card.dataset.category !== category) {
                    ok = false;
                }
                card.hidden = !ok;
            });
        }

        function applySort() {
            if (!cardList || !sortSelect) {
                return;
            }
            var mode = sortSelect.value;
            var sorted = cards.slice().sort(function (a, b) {
                if (mode === "year-asc") {
                    return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                }
                if (mode === "title-asc") {
                    return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""), "zh-CN");
                }
                return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
            });
            sorted.forEach(function (card) {
                cardList.appendChild(card);
            });
            applyFilters();
        }

        [queryInput, yearSelect, genreSelect, categorySelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });
        if (sortSelect) {
            sortSelect.addEventListener("change", applySort);
            applySort();
        } else {
            applyFilters();
        }
    });
})();

function initializeMoviePlayer(streamUrl) {
    var video = document.querySelector("[data-player]");
    var overlay = document.querySelector("[data-play-overlay]");
    if (!video || !streamUrl) {
        return;
    }
    var attached = false;
    var hls = null;

    function attachStream() {
        if (attached) {
            return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function beginPlayback() {
        attachStream();
        video.controls = true;
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
        var action = video.play();
        if (action && typeof action.catch === "function") {
            action.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", beginPlayback);
    }
    video.addEventListener("click", function () {
        if (video.paused) {
            beginPlayback();
        }
    });
    video.addEventListener("play", function () {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    });
    window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
            hls.destroy();
        }
    });
}
