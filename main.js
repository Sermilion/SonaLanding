(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve = "IntersectionObserver" in window;

  /* ---------- Reveal: only what starts below the fold animates in ---------- */
  if (!reduceMotion && canObserve) {
    const targets = document.querySelectorAll(".section .center-head, .section .split-head, .pillars li, .tile, .method-grid, .cta-inner");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-pending");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el, i) => {
      el.classList.add("reveal");
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.transitionDelay = `${(i % 3) * 70}ms`;
      el.classList.add("is-pending");
      io.observe(el);
    });
  }

  /* ---------- Manifesto: lines light up as they cross the middle ---------- */
  const mItems = document.querySelectorAll(".m-item");
  if (reduceMotion || !canObserve) {
    mItems.forEach((el) => el.classList.add("is-lit"));
  } else {
    const mio = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-lit", e.isIntersecting)),
      { rootMargin: "-35% 0px -35% 0px" }
    );
    mItems.forEach((el) => mio.observe(el));
  }

  /* ---------- Hero app mockup: the subtask advances through its pipeline ---------- */
  const pipe = document.getElementById("app-pipe");
  if (pipe && !reduceMotion) {
    const steps = Array.from(pipe.children);
    const phaseLabel = document.getElementById("app-phase");
    const rowState = document.getElementById("app-row-2-state");
    const elapsed = document.getElementById("app-elapsed");
    const bar = document.getElementById("app-bar");
    const log = document.getElementById("app-log");
    const start = steps.findIndex((s) => s.classList.contains("is-run"));
    let current = start;
    let seconds = 18 * 60 + 42;

    const LOG = {
      validate: "project checks passed",
      history: "2 decisions recorded in agent/",
      commit: "ORD-142.2 committed",
    };

    const render = () => {
      steps.forEach((s, i) => {
        s.classList.toggle("is-done", i < current);
        s.classList.toggle("is-run", i === current);
      });
      const name = steps[current].textContent.trim();
      phaseLabel.textContent = name;
      rowState.textContent = name;
      bar.style.width = `${Math.round(((current + 1) / steps.length) * 100 * 0.34 + 33)}%`;
    };

    const addLog = (phase) => {
      if (!LOG[phase]) return;
      const li = document.createElement("li");
      li.innerHTML = `<b>${phase}</b> ${LOG[phase]}`;
      log.appendChild(li);
      while (log.children.length > 3) log.removeChild(log.firstElementChild);
    };

    window.setInterval(() => {
      seconds += 1;
      const m = Math.floor(seconds / 60);
      const s = String(seconds % 60).padStart(2, "0");
      elapsed.textContent = `${m}m ${s}s`;
    }, 1000);

    const advance = () => {
      addLog(steps[current].textContent.trim());
      if (current < steps.length - 1) {
        current += 1;
        render();
        window.setTimeout(advance, 2200);
      } else {
        window.setTimeout(() => {
          current = start;
          render();
          window.setTimeout(advance, 2200);
        }, 3000);
      }
    };
    window.setTimeout(advance, 2600);
  }

  /* ---------- Method explorer ---------- */
  const STAGES = {
    spec: {
      title: "Spec",
      text: "Intake turns an issue and its acceptance criteria into a spec bundle kept on your machine, outside version control. No issue key? It takes the next free one.",
      out: "spec.md",
    },
    plan: {
      title: "Plan",
      text: "Preplan reads your repository instructions and the history kept next to the code, once per goal. Plan splits the work into dependency-ordered subtasks, each with its own spec.",
      out: "preplan_digest · plan",
    },
    execute: {
      title: "Execute",
      text: "Each subtask starts with a fresh context. Implement, simplify, then audit every acceptance criterion against the code and repair the gaps. A repair round that closes nothing stops the run.",
      out: "implementation_summary · audit_report",
    },
    review: {
      title: "Review",
      text: "Platform packs route the review to stack specialists. Findings are verified, blockers get fixed, and your project's own checks run until they pass. Learnings you confirmed earlier apply here.",
      out: "review_result · validation_result",
    },
    finalise: {
      title: "Finalise",
      text: "History and decisions are written next to the code. One commit per subtask. QA drives the app on a device when the pack supports it. Then the pull request opens and CI is watched and repaired.",
      out: "history_result · pr_result",
    },
  };

  const grid = document.getElementById("method-grid");
  if (grid) {
    const CYCLE = 4200;
    const tabs = Array.from(grid.querySelectorAll(".stage"));
    const nodes = Array.from(grid.querySelectorAll("[data-node]"));
    const panel = document.getElementById("method-panel");
    const title = document.getElementById("panel-title");
    const text = document.getElementById("panel-text");
    const out = document.getElementById("panel-out");
    let index = 0;
    let timer = null;
    let manual = false;

    grid.style.setProperty("--cycle", `${CYCLE}ms`);

    const select = (i, focus = false) => {
      index = i;
      const tab = tabs[i];
      const uses = (tab.dataset.uses || "").split(/\s+/);
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(j === i));
        t.tabIndex = j === i ? 0 : -1;
        const bar = t.querySelector(".stage-bar");
        bar.classList.remove("is-timing");
        if (j === i && timer && !manual) {
          void bar.offsetWidth;
          bar.classList.add("is-timing");
        }
      });
      nodes.forEach((n) => n.classList.toggle("is-lit", uses.includes(n.dataset.node)));
      panel.setAttribute("aria-labelledby", tab.id);
      const data = STAGES[tab.dataset.stage];
      title.textContent = data.title;
      text.textContent = data.text;
      out.textContent = data.out;
      if (focus) tab.focus();
    };

    const stop = () => {
      manual = true;
      window.clearInterval(timer);
      timer = null;
      tabs.forEach((t) => t.querySelector(".stage-bar").classList.remove("is-timing"));
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        stop();
        select(i);
      });
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        let next = step === undefined ? null : (i + step + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        stop();
        select(next, true);
      });
    });

    select(0);

    if (!reduceMotion && canObserve) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (manual) return;
            if (entry.isIntersecting && !timer) {
              timer = window.setInterval(() => select((index + 1) % tabs.length), CYCLE);
              select(index);
            } else if (!entry.isIntersecting && timer) {
              window.clearInterval(timer);
              timer = null;
            }
          });
        },
        { threshold: 0.4 }
      ).observe(grid);
    }
  }

  /* ---------- Install copy ---------- */
  const copy = document.getElementById("copy-install");
  if (copy) {
    const source = document.querySelector(copy.dataset.copy);
    const idle = copy.textContent.trim();
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(source.textContent.trim());
        copy.classList.add("is-copied");
        copy.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(source);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copy.textContent = "Select and copy";
      }
      window.setTimeout(() => {
        copy.classList.remove("is-copied");
        copy.textContent = idle;
      }, 1800);
    });
  }
})();
