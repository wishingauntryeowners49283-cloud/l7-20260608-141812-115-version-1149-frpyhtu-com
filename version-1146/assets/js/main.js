(function () {
    var navButton = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('open');
            navButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navButton.textContent = isOpen ? '×' : '☰';
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var previous = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                slide.classList.toggle('hero-slide-active', i === activeIndex);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle('hero-dot-active', i === activeIndex);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-slide')) || 0);
                startTimer();
            });
        });

        if (previous) {
            previous.addEventListener('click', function () {
                showSlide(activeIndex - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(activeIndex + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    var switchers = document.querySelectorAll('.view-switch');

    switchers.forEach(function (switcher) {
        var grid = document.querySelector('[data-view-grid]');

        if (!grid) {
            return;
        }

        switcher.addEventListener('click', function (event) {
            var button = event.target.closest('[data-view]');

            if (!button) {
                return;
            }

            switcher.querySelectorAll('[data-view]').forEach(function (item) {
                item.classList.toggle('view-active', item === button);
            });

            grid.classList.toggle('list-view', button.getAttribute('data-view') === 'list');
        });
    });

    var chipFilter = document.querySelector('[data-chip-filter]');
    var filterGrid = document.querySelector('.filter-grid');

    if (chipFilter && filterGrid) {
        chipFilter.addEventListener('click', function (event) {
            var button = event.target.closest('[data-chip]');

            if (!button) {
                return;
            }

            var value = (button.getAttribute('data-chip') || '').toLowerCase();

            chipFilter.querySelectorAll('[data-chip]').forEach(function (item) {
                item.classList.toggle('chip-active', item === button);
            });

            filterGrid.querySelectorAll('.movie-card').forEach(function (card) {
                var text = (card.getAttribute('data-genre') || '').toLowerCase() + ' ' + (card.getAttribute('data-search') || '').toLowerCase();
                card.hidden = value && text.indexOf(value) === -1;
            });
        });
    }

    var searchInput = document.querySelector('[data-search-input]');
    var searchResults = document.querySelector('[data-search-results]');
    var searchStatus = document.querySelector('[data-search-status]');

    if (searchInput && searchResults) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        searchInput.value = initialQuery;

        function runSearch() {
            var query = searchInput.value.trim().toLowerCase();
            var visible = 0;

            searchResults.querySelectorAll('.movie-card').forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var match = !query || text.indexOf(query) !== -1;
                card.hidden = !match;

                if (match) {
                    visible += 1;
                }
            });

            if (searchStatus) {
                searchStatus.textContent = query ? '搜索结果' : '片库内容';
            }
        }

        searchInput.addEventListener('input', runSearch);
        runSearch();
    }

    document.querySelectorAll('[data-scroll-player]').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            var cover = document.querySelector('[data-player-cover]');

            if (cover) {
                cover.click();
            }
        });
    });
})();
