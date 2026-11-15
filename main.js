(() => {
  // Downloads: choose once on load, then leave the selection to the visitor.
  const packages = {
    mac: { name: "macOS", info: "Apple Silicon only, .dmg installer", file: "sona-latest-macos-arm64.dmg" },
    windows: { name: "Windows", info: "x64, .msi installer", file: "sona-latest-windows-x64.msi" },
    linux: { name: "Linux", info: "Debian / Ubuntu x64, .deb installer", file: "sona-latest-linux-x64.deb" },
  };
  const picker = document.querySelector(".platform-picker");
  const packagePanel = document.querySelector(".download-package");

  function selectPlatform(os) {
    const item = packages[os];
    picker.querySelectorAll("[data-os]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.os === os));
    });
    if (!item) return;
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
