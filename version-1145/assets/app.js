(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;
    var showSlide = function (next) {
      if (!slides.length) {
        return;
      }
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide') || 0));
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var filterGrid = document.querySelector('[data-filter-grid]');
  var filterState = document.querySelector('[data-filter-state]');
  if (filterForm && filterGrid) {
    var params = new URLSearchParams(window.location.search);
    var qInput = filterForm.querySelector('[name="q"]');
    var catSelect = filterForm.querySelector('[name="category"]');
    var yearSelect = filterForm.querySelector('[name="year"]');
    if (qInput && params.get('q')) {
      qInput.value = params.get('q');
    }
    if (catSelect && params.get('category')) {
      catSelect.value = params.get('category');
    }
    var applyFilter = function () {
      var q = qInput ? qInput.value.trim().toLowerCase() : '';
      var cat = catSelect ? catSelect.value : '';
      var year = yearSelect && yearSelect.value ? Number(yearSelect.value) : 0;
      var visible = 0;
      Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card')).forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-category'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' ').toLowerCase();
        var cardYear = Number(card.getAttribute('data-year') || 0);
        var cardCat = card.getAttribute('data-category') || '';
        var matched = (!q || haystack.indexOf(q) !== -1) && (!cat || cardCat === cat) && (!year || cardYear >= year);
        card.classList.toggle('is-filtered-out', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (filterState) {
        filterState.textContent = visible ? '已筛选出 ' + visible + ' 部相关影片' : '没有找到匹配影片';
      }
    };
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });
    ['input', 'change'].forEach(function (eventName) {
      filterForm.addEventListener(eventName, applyFilter);
    });
    applyFilter();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-sort-scope]')).forEach(function (toolbar) {
    var grid = toolbar.parentElement.querySelector('[data-card-grid]');
    if (!grid) {
      return;
    }
    Array.prototype.slice.call(toolbar.querySelectorAll('[data-sort]')).forEach(function (button) {
      button.addEventListener('click', function () {
        var mode = button.getAttribute('data-sort');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        cards.sort(function (a, b) {
          if (mode === 'title') {
            return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
          }
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        });
        cards.forEach(function (card) {
          grid.appendChild(card);
        });
      });
    });
  });
})();
