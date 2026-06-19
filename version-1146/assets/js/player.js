function initMoviePlayer(source) {
    var video = document.querySelector('[data-player-video]');
    var cover = document.querySelector('[data-player-cover]');
    var hlsInstance = null;
    var loaded = false;

    if (!video || !source) {
        return;
    }

    function loadSource() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });

            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);

            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                    return;
                }

                if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                    return;
                }

                hlsInstance.destroy();
            });

            return;
        }

        video.src = source;
    }

    function playVideo() {
        loadSource();

        if (cover) {
            cover.hidden = true;
        }

        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
