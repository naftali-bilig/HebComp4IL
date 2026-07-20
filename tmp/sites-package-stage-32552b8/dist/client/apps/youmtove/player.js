(() => {
  const controlsMarkup = `
    <button class="ytv-overlay" type="button" aria-label="הפעלת הסרטון"><span aria-hidden="true">▶</span></button>
    <div class="ytv-controls" aria-label="פקדי הסרטון">
      <input class="ytv-progress" type="range" min="0" max="1000" value="0" aria-label="מיקום בסרטון">
      <div class="ytv-toolbar">
        <button class="ytv-play" type="button" aria-label="הפעלה">▶</button>
        <button class="ytv-back" type="button" aria-label="חזרה 10 שניות">↶10</button>
        <button class="ytv-forward" type="button" aria-label="קדימה 10 שניות">10↷</button>
        <button class="ytv-sound" type="button" aria-label="השתקה">🔊</button>
        <input class="ytv-volume" type="range" min="0" max="1" step="0.05" value="1" aria-label="עוצמת שמע">
        <span class="ytv-time" aria-live="off">0:00 / 0:00</span>
        <span class="ytv-spacer"></span>
        <select class="ytv-rate" aria-label="מהירות ניגון">
          <option value="0.5">×0.5</option>
          <option value="0.75">×0.75</option>
          <option value="1" selected>×1</option>
          <option value="1.25">×1.25</option>
          <option value="1.5">×1.5</option>
          <option value="2">×2</option>
        </select>
        <button class="ytv-background" type="button" aria-label="המשך בשמע ברקע" hidden>♫</button>
        <button class="ytv-pip" type="button" aria-label="תמונה בתוך תמונה">▣</button>
        <button class="ytv-expand" type="button" aria-label="מסך גדול" aria-pressed="false">⛶</button>
      </div>
    </div>`;

  const enhance = player => {
    if (player.dataset.youmtoveReady === "true") return;
    const video = player.querySelector("video");
    if (!video) return;
    player.dataset.youmtoveReady = "true";
    player.classList.add("youmtove-player");
    player.tabIndex = 0;
    player.setAttribute("aria-label", player.dataset.title || "נגן יום-טיוב");
    player.insertAdjacentHTML("beforeend", controlsMarkup);

    const overlay = player.querySelector(".ytv-overlay");
    const play = player.querySelector(".ytv-play");
    const progress = player.querySelector(".ytv-progress");
    const time = player.querySelector(".ytv-time");
    const sound = player.querySelector(".ytv-sound");
    const volume = player.querySelector(".ytv-volume");
    const back = player.querySelector(".ytv-back");
    const forward = player.querySelector(".ytv-forward");
    const rate = player.querySelector(".ytv-rate");
    const background = player.querySelector(".ytv-background");
    const pip = player.querySelector(".ytv-pip");
    const expand = player.querySelector(".ytv-expand");
    video.removeAttribute("controls");
    video.removeAttribute("disablepictureinpicture");

    const clock = seconds => {
      if (!Number.isFinite(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
      return `${minutes}:${rest}`;
    };
    const update = () => {
      const playing = !video.paused && !video.ended;
      player.classList.toggle("is-playing", playing);
      play.textContent = playing ? "❚❚" : "▶";
      play.setAttribute("aria-label", playing ? "השהיה" : "הפעלה");
      overlay.setAttribute("aria-label", playing ? "השהיית הסרטון" : "הפעלת הסרטון");
      progress.value = video.duration ? Math.round(video.currentTime / video.duration * 1000) : 0;
      time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
      sound.textContent = video.muted ? "🔇" : "🔊";
      sound.setAttribute("aria-label", video.muted ? "הפעלת שמע" : "השתקה");
      volume.value = video.muted ? 0 : video.volume;
    };
    const togglePlayback = () => video.paused ? video.play() : video.pause();
    let backgroundActive = false;
    const setExpanded = expanded => {
      player.classList.toggle("is-expanded", expanded);
      document.body.classList.toggle("youmtove-expanded", expanded);
      expand.setAttribute("aria-pressed", String(expanded));
      expand.setAttribute("aria-label", expanded ? "יציאה ממסך גדול" : "מסך גדול");
    };
    const toggleExpanded = async () => {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (player.requestFullscreen) {
        try {
          await player.requestFullscreen();
          return;
        } catch (_) { }
      }
      setExpanded(!player.classList.contains("is-expanded"));
    };

    overlay.addEventListener("click", togglePlayback);
    play.addEventListener("click", togglePlayback);
    video.addEventListener("click", togglePlayback);
    ["play", "pause", "ended", "loadedmetadata", "timeupdate"].forEach(event => {
      video.addEventListener(event, update);
    });
    progress.addEventListener("input", () => {
      if (video.duration) video.currentTime = Number(progress.value) / 1000 * video.duration;
    });
    back.addEventListener("click", () => { video.currentTime = Math.max(0, video.currentTime - 10); });
    forward.addEventListener("click", () => {
      video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    });
    sound.addEventListener("click", () => {
      video.muted = !video.muted;
      update();
    });
    volume.addEventListener("input", () => {
      video.volume = Number(volume.value);
      video.muted = video.volume === 0;
      update();
    });
    rate.addEventListener("change", () => { video.playbackRate = Number(rate.value); });

    const backgroundAudio = window.JClockAudio;
    if (backgroundAudio && typeof backgroundAudio.startBackgroundAudio === "function") {
      background.hidden = false;
    }
    background.addEventListener("click", () => {
      if (!backgroundAudio) return;
      if (backgroundActive) {
        const position = Number(backgroundAudio.backgroundPositionMillis?.()) / 1000;
        backgroundAudio.stopBackgroundAudio();
        if (Number.isFinite(position) && position > 0) video.currentTime = position;
        backgroundActive = false;
        background.textContent = "♫";
        background.setAttribute("aria-label", "המשך בשמע ברקע");
        video.play();
        return;
      }
      backgroundAudio.startBackgroundAudio(
        video.currentSrc,
        Math.round(video.currentTime * 1000),
        Math.round((video.muted ? 0 : video.volume) * 100),
      );
      video.pause();
      backgroundActive = true;
      background.textContent = "■";
      background.setAttribute("aria-label", "חזרה מהשמע ברקע לנגן");
    });

    pip.hidden = !(document.pictureInPictureEnabled && video.requestPictureInPicture);
    pip.addEventListener("click", async () => {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
      } catch (_) { }
    });
    expand.addEventListener("click", toggleExpanded);
    document.addEventListener("fullscreenchange", () => {
      setExpanded(document.fullscreenElement === player);
    });
    player.addEventListener("keydown", event => {
      if (["INPUT", "SELECT", "BUTTON"].includes(event.target.tagName)) return;
      if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        togglePlayback();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
      }
      if (event.key.toLowerCase() === "m") {
        video.muted = !video.muted;
        update();
      }
      if (event.key.toLowerCase() === "f") toggleExpanded();
    });
    update();
  };

  document.querySelectorAll("[data-youmtove]").forEach(enhance);
  window.YoumTove = { enhance };
})();
