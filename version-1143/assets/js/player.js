(function () {
  window.initMoviePlayer = function (sourceUrl, videoId, overlayId, playButtonId) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var playButton = document.getElementById(playButtonId);
    var attached = false;
    var hls = null;

    if (!video || !overlay || !playButton || !sourceUrl) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
      attached = true;
    }

    function start() {
      attach();
      overlay.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    }

    overlay.addEventListener('click', start);
    playButton.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!attached || video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  };
})();
