import { H as Hls } from './hls.js';

export function initPlayer(streamUrl) {
  var video = document.querySelector('[data-player]');
  var overlay = document.querySelector('[data-play-overlay]');
  if (!video || !streamUrl) {
    return;
  }

  var ready = false;
  var hls = null;

  var attach = function () {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }
    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }
    video.src = streamUrl;
  };

  var start = function () {
    attach();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  };

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('click', function () {
    if (!ready) {
      start();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
