(() => {
  // Copy buttons
  const status = document.getElementById("copy-status");
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = document.getElementById(btn.dataset.copy).textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        btn.dataset.state = "done";
        status.textContent = "Install command copied";
      } catch {
        btn.textContent = "Select";
        status.textContent = "Copy failed. Select the command manually.";
      }
      setTimeout(() => { btn.textContent = "Copy"; delete btn.dataset.state; }, 1600);
    });
  });

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
