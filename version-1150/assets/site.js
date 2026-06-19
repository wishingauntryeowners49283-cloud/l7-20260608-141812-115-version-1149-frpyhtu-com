(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMobileMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
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

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var scope = document.querySelector("[data-filter-scope]");
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
        var textInput = scope.querySelector("[data-filter-text]");
        var yearSelect = scope.querySelector("[data-filter-year]");
        var typeSelect = scope.querySelector("[data-filter-type]");
        var resetButton = scope.querySelector("[data-filter-reset]");
        var status = scope.querySelector("[data-filter-status]");
        var query = new URLSearchParams(window.location.search).get("q") || "";

        if (textInput && query) {
            textInput.value = query;
        }

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(textInput ? textInput.value : "");
            var year = normalize(yearSelect ? yearSelect.value : "");
            var type = normalize(typeSelect ? typeSelect.value : "");
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year")
                ].join(" "));
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesYear = !year || normalize(card.getAttribute("data-year")) === year;
                var matchesType = !type || normalize(card.getAttribute("data-type")) === type;
                var isVisible = matchesKeyword && matchesYear && matchesType;
                card.classList.toggle("is-hidden", !isVisible);
                if (isVisible) {
                    visible += 1;
                }
            });

            if (status) {
                status.textContent = "当前显示 " + visible + " 部影片";
            }
        }

        [textInput, yearSelect, typeSelect].forEach(function (field) {
            if (!field) {
                return;
            }
            field.addEventListener("input", applyFilter);
            field.addEventListener("change", applyFilter);
        });

        if (resetButton) {
            resetButton.addEventListener("click", function () {
                if (textInput) {
                    textInput.value = "";
                }
                if (yearSelect) {
                    yearSelect.value = "";
                }
                if (typeSelect) {
                    typeSelect.value = "";
                }
                applyFilter();
            });
        }

        applyFilter();
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        if (!players.length) {
            return;
        }
        window.__movieHlsInstances = window.__movieHlsInstances || [];

        players.forEach(function (player) {
            var video = player.querySelector("video");
            var overlay = player.querySelector(".play-overlay");
            var source = player.getAttribute("data-video");
            var initialized = false;

            if (!video || !source) {
                return;
            }

            function initializeVideo() {
                if (initialized) {
                    return;
                }
                initialized = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    window.__movieHlsInstances.push(hls);
                    return;
                }

                video.src = source;
            }

            function playVideo() {
                initializeVideo();
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        if (overlay) {
                            overlay.classList.remove("is-hidden");
                        }
                    });
                }
            }

            if (overlay) {
                overlay.addEventListener("click", playVideo);
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    playVideo();
                }
            });

            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            });

            video.addEventListener("pause", function () {
                if (overlay) {
                    overlay.classList.remove("is-hidden");
                }
            });
        });
    }

    ready(function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
