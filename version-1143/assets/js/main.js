(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var next = hero.querySelector('[data-hero-next]');
    var prev = hero.querySelector('[data-hero-prev]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupRails() {
    document.querySelectorAll('.rail-shell').forEach(function (shell) {
      var rail = shell.querySelector('[data-rail]');
      var left = shell.querySelector('[data-rail-left]');
      var right = shell.querySelector('[data-rail-right]');
      if (!rail) {
        return;
      }
      if (left) {
        left.addEventListener('click', function () {
          rail.scrollBy({ left: -420, behavior: 'smooth' });
        });
      }
      if (right) {
        right.addEventListener('click', function () {
          rail.scrollBy({ left: 420, behavior: 'smooth' });
        });
      }
    });
  }

  function setupLocalFilter() {
    var input = document.querySelector('[data-filter-input]');
    var scope = document.querySelector('[data-filter-scope]');
    if (!input || !scope) {
      return;
    }
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search-text') || '').toLowerCase();
        card.classList.toggle('is-hidden', query && text.indexOf(query) === -1);
      });
    });
  }

  function createMovieCard(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card" data-card>',
      '<a class="card-link" href="' + escapeHtml(movie.url) + '">',
      '<div class="poster-wrap">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="rating-badge">' + escapeHtml(movie.rating) + '</span>',
      '<span class="play-badge">▶</span>',
      '<div class="poster-caption">',
      '<h3>' + escapeHtml(movie.title) + '</h3>',
      '<div class="meta-line"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
      '</div>',
      '</div>',
      '<div class="card-body">',
      '<p>' + escapeHtml(movie.description) + '</p>',
      '<div class="tag-row">' + tags + '</div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page || !window.SEARCH_MOVIES) {
      return;
    }
    var queryInput = page.querySelector('[data-site-search]');
    var typeFilter = page.querySelector('[data-type-filter]');
    var regionFilter = page.querySelector('[data-region-filter]');
    var results = page.querySelector('[data-search-results]');
    if (!queryInput || !results) {
      return;
    }

    function render() {
      var query = queryInput.value.trim().toLowerCase();
      var type = typeFilter ? typeFilter.value : '';
      var region = regionFilter ? regionFilter.value : '';
      var filtered = window.SEARCH_MOVIES.filter(function (movie) {
        var text = movie.search.toLowerCase();
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesType = !type || movie.type.indexOf(type) !== -1;
        var matchesRegion = !region || movie.region.indexOf(region) !== -1;
        return matchesQuery && matchesType && matchesRegion;
      }).slice(0, 80);
      results.innerHTML = filtered.map(createMovieCard).join('');
    }

    queryInput.addEventListener('input', render);
    if (typeFilter) {
      typeFilter.addEventListener('change', render);
    }
    if (regionFilter) {
      regionFilter.addEventListener('change', render);
    }
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupRails();
    setupLocalFilter();
    setupSearchPage();
  });
})();
