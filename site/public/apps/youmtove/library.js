(() => {
  const library = document.querySelector("[data-youmtove-library]");
  const player = document.querySelector("[data-youmtove]");
  const video = player?.querySelector("video");
  const source = video?.querySelector("source");
  const title = document.querySelector("[data-youmtove-title]");
  const status = document.querySelector("[data-youmtove-status]");
  if (!library || !player || !video || !source) return;

  const root = "https://pub-71e18ce829fd428ea6d4aa9498a7e642.r2.dev/TuningLimud/";
  const validName = name => /^[^/\\]+\.mp4$/i.test(name);
  const labelFromName = name => name.replace(/\.mp4$/i, "").replaceAll("_", " ");
  const normalize = value => {
    const item = typeof value === "string" ? { name: value } : value;
    const name = String(item?.name || item?.file || "").trim();
    if (!validName(name)) return null;
    return { name, title: String(item?.title || labelFromName(name)).trim() };
  };

  const selectVideo = (entry, button) => {
    video.pause();
    source.src = new URL(encodeURIComponent(entry.name), root).toString();
    player.dataset.title = entry.title;
    player.setAttribute("aria-label", entry.title);
    if (title) title.textContent = entry.title;
    library.querySelectorAll("button").forEach(item => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    video.load();
  };

  fetch(new URL("manifest.json", root), { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(manifest => {
      const raw = Array.isArray(manifest) ? manifest : (manifest.files || manifest.videos || []);
      const entries = raw.map(normalize).filter(Boolean);
      if (!entries.length) throw new Error("empty catalog");
      library.replaceChildren();
      entries.forEach((entry, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = entry.title;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => selectVideo(entry, button));
        library.appendChild(button);
        if (index === 0) selectVideo(entry, button);
      });
      if (status) status.textContent = `${entries.length} סרטונים בספריית TuningLimud`;
    })
    .catch(() => {
      if (status) status.textContent = "מוצג הסרטון המקומי; ספריית TuningLimud תיטען כשהיא תהיה זמינה.";
    });
})();
