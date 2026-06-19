(function () {
    var hlsPromise = null;

    function loadHls(callback) {
        if (window.Hls) {
            callback();
            return;
        }
        if (!hlsPromise) {
            hlsPromise = new Promise(function (resolve) {
                var script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
                script.onload = resolve;
                script.onerror = resolve;
                document.head.appendChild(script);
            });
        }
        hlsPromise.then(callback);
    }

    function attach(video, source, done) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            done();
            return;
        }
        loadHls(function () {
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video._hls = hls;
                done();
                return;
            }
            video.src = source;
            done();
        });
    }

    window.bindVideoPlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var layer = document.getElementById(options.layerId);
        var started = false;

        if (!video || !layer || !options.source) {
            return;
        }

        function play() {
            function launch() {
                layer.classList.add("is-hidden");
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }

            if (started) {
                launch();
                return;
            }

            started = true;
            attach(video, options.source, launch);
        }

        layer.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        });
    };
})();
