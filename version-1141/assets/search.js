(function () {
    function createMovieCard(movie) {
        var article = document.createElement("article");
        article.className = "movie-card";

        var posterLink = document.createElement("a");
        posterLink.className = "poster-link";
        posterLink.href = movie.url;

        var image = document.createElement("img");
        image.src = movie.image;
        image.alt = movie.title;
        image.loading = "lazy";
        posterLink.appendChild(image);

        var badge = document.createElement("span");
        badge.className = "poster-badge";
        badge.textContent = movie.type;
        posterLink.appendChild(badge);

        var body = document.createElement("div");
        body.className = "movie-card-body";

        var meta = document.createElement("div");
        meta.className = "movie-meta";
        meta.textContent = movie.year + " · " + movie.region + " · " + movie.genre;

        var title = document.createElement("h3");
        var titleLink = document.createElement("a");
        titleLink.href = movie.url;
        titleLink.textContent = movie.title;
        title.appendChild(titleLink);

        var desc = document.createElement("p");
        desc.textContent = movie.description;

        var tags = document.createElement("div");
        tags.className = "movie-tags";
        movie.tags.slice(0, 4).forEach(function (item) {
            var tag = document.createElement("span");
            tag.textContent = item;
            tags.appendChild(tag);
        });

        var foot = document.createElement("div");
        foot.className = "movie-card-foot";
        var genre = document.createElement("span");
        genre.textContent = movie.genre;
        var action = document.createElement("a");
        action.href = movie.url;
        action.textContent = "立即观看";
        foot.appendChild(genre);
        foot.appendChild(action);

        body.appendChild(meta);
        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(tags);
        body.appendChild(foot);
        article.appendChild(posterLink);
        article.appendChild(body);
        return article;
    }

    function render(query) {
        var results = document.querySelector("[data-search-results]");
        var count = document.querySelector("[data-search-count]");
        if (!results || !window.SEARCH_MOVIES) {
            return;
        }
        var value = (query || "").trim().toLowerCase();
        var list = window.SEARCH_MOVIES.filter(function (movie) {
            if (!value) {
                return true;
            }
            var source = [movie.title, movie.description, movie.year, movie.region, movie.type, movie.genre, movie.tags.join(" ")].join(" ").toLowerCase();
            return source.indexOf(value) !== -1;
        }).slice(0, 120);
        results.innerHTML = "";
        list.forEach(function (movie) {
            results.appendChild(createMovieCard(movie));
        });
        if (count) {
            count.textContent = value ? "找到 " + list.length + " 个匹配结果" : "为你展示片库中的精选内容";
        }
    }

    function init() {
        var form = document.querySelector("[data-site-search]");
        var input = form ? form.querySelector("input[name='q']") : null;
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        if (input) {
            input.value = initial;
        }
        render(initial);
        if (form && input) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var value = input.value.trim();
                var next = value ? "?q=" + encodeURIComponent(value) : window.location.pathname;
                history.replaceState(null, "", next);
                render(value);
            });
            input.addEventListener("input", function () {
                render(input.value);
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
