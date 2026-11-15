(() => {
  // Downloads: choose once on load, then leave the selection to the visitor.
  const packages = {
    mac: { name: "macOS", architecture: "arm64", info: "Apple Silicon only, .dmg installer", file: "sona-latest-macos-arm64.dmg" },
    windows: { name: "Windows", architecture: "x64", info: "x64, .msi installer", file: "sona-latest-windows-x64.msi" },
    linux: { name: "Linux", architecture: "x64", info: "Debian / Ubuntu x64, .deb installer", file: "sona-latest-linux-x64.deb" },
  };
  const picker = document.querySelector(".platform-picker");
  const packagePanel = document.querySelector(".download-package");
  const downloadLink = document.getElementById("download-link");
  let selectedPlatform = null;

  // Only production clicks count. This file contains public ingestion configuration.
  const analyticsEnabled = ["sona-ade.com", "www.sona-ade.com"].includes(location.hostname)
    && navigator.doNotTrack !== "1" && !navigator.globalPrivacyControl;
  const analyticsConfig = analyticsEnabled
    ? fetch("analytics-config.json", { credentials: "omit", keepalive: true })
      .then((response) => response.ok ? response.json() : null)
      .catch(() => null)
    : Promise.resolve(null);

  async function trackDownload(platform) {
    try {
      const config = await analyticsConfig;
      const item = packages[platform];
      if (!config?.api_host || !config.project_token || !item) return;
      await fetch(config.api_host + "/i/v0/e/", {
        method: "POST",
        mode: "no-cors",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          api_key: config.project_token,
          event: "download_clicked",
          distinct_id: crypto.randomUUID(),
          properties: {
            source: "sona_landing",
            platform,
            architecture: item.architecture,
            filename: item.file,
            $process_person_profile: false,
            $geoip_disable: true,
          },
        }),
      });
    } catch {
      // Analytics must never interrupt the installer's normal link navigation.
    }
  }

  downloadLink.addEventListener("click", () => {
    if (!downloadLink.hidden) void trackDownload(selectedPlatform);
  });
  downloadLink.addEventListener("auxclick", (event) => {
    if (event.button === 1 && !downloadLink.hidden) void trackDownload(selectedPlatform);
  });

  function selectPlatform(os) {
    const item = packages[os];
    picker.querySelectorAll("[data-os]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.os === os));
    });
    if (!item) return;
    selectedPlatform = os;
    const url = "https://sonadesktop.hel1.your-objectstorage.com/latest/" + item.file;
    document.getElementById("download-platform").textContent = "Sona for " + item.name;
    document.getElementById("download-compat").textContent = item.info;
    document.getElementById("download-label").textContent = "Download for " + item.name;
    const link = document.getElementById("download-link");
    link.href = url;
    link.hidden = false;
    document.getElementById("download-checksum").href = url + ".sha256";
    document.getElementById("download-meta").hidden = false;
  }

  function detectPlatform() {
    const ua = navigator.userAgent || "";
    const platform = navigator.userAgentData?.platform || navigator.platform || ua;
    const mobile = navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    const ipad = /Mac/i.test(platform) && navigator.maxTouchPoints > 1;
    if (mobile || ipad || /CrOS/i.test(ua)) return null;
    if (/Mac/i.test(platform)) return "mac";
    if (/Win/i.test(platform)) return "windows";
    if (/Linux/i.test(platform)) return "linux";
    return null;
  }

  picker.querySelectorAll("[data-os]").forEach((button) => {
    button.addEventListener("click", () => selectPlatform(button.dataset.os));
  });
  selectPlatform(detectPlatform());
  picker.hidden = false;
  packagePanel.hidden = false;

  // Product preview: phase pipeline that advances, and ticking timers.
  const phases = ["preplan", "plan", "plan_subtasks", "implement", "simplify", "audit", "review", "verify_findings", "implement_fix", "build", "validate", "write_history", "commit_push"];
  const loopFrom = phases.indexOf("review");
  const loopTo = phases.indexOf("validate");
  let current = loopFrom;
  const pipeline = document.getElementById("m-pipeline");
  const phaseStat = document.getElementById("m-phase");
  const activity = document.getElementById("m-activity");
  const count = document.getElementById("m-act-count");
  const events = {
    verify_findings: "<b>review</b> 5 findings, verifying each",
    implement_fix: "<b>verify</b> 4 confirmed, 1 rejected",
    build: "<b>claude</b> applied 4 fixes",
    validate: "<b>build</b> passed in 1m 12s",
    review: "<b>validate</b> passed · tests, lint, format",
  };

  function renderPipeline() {
    pipeline.innerHTML = phases.map((p, i) => {
      const cls = i < current ? "is-done" : i === current ? "is-run" : "";
      const label = i === current ? `${p} · run 1` : p;
      return (i ? '<span class="dash"></span>' : "") + `<span class="phase ${cls}">${label}</span>`;
    }).join("");
    phaseStat.textContent = phases[current];
  }

  function log(html) {
    const li = document.createElement("li");
    li.className = "is-new";
    li.innerHTML = `<span class="av av--run">✓</span><span>${html} <span class="ago">· now</span></span>`;
    activity.prepend(li);
    while (activity.children.length > 3) activity.lastElementChild.remove();
    count.textContent = String(Number(count.textContent) + 1);
  }

  renderPipeline();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let goalSec = 43 * 60 + 12;
  let subSec = 15 * 60 + 54;
  const fmt = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
  setInterval(() => {
    goalSec += 1; subSec += 1;
    document.getElementById("m-goal").textContent = `${Math.floor(goalSec / 60)}m`;
    document.getElementById("m-sub").textContent = fmt(subSec);
    document.getElementById("m-sub-row").textContent = fmt(subSec);
  }, 1000);

  setInterval(() => {
    if (document.hidden) return;
    current = current >= loopTo ? loopFrom : current + 1;
    renderPipeline();
    if (events[phases[current]]) log(events[phases[current]]);
  }, 3200);
})();
