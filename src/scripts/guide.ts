const motionToggle = document.querySelector<HTMLInputElement>("#motion-toggle");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMotion(enabled: boolean): void {
  document.documentElement.classList.toggle("no-motion", !enabled);
  document.body.classList.toggle("no-motion", !enabled);
}

if (motionToggle) {
  motionToggle.checked = !prefersReducedMotion.matches;
  setMotion(motionToggle.checked);
  motionToggle.addEventListener("change", () => setMotion(motionToggle.checked));
  prefersReducedMotion.addEventListener("change", (event) => {
    motionToggle.checked = !event.matches;
    setMotion(motionToggle.checked);
  });
}

document.querySelectorAll<HTMLElement>("[data-lesson]").forEach((lesson) => {
  const steps = [...lesson.querySelectorAll<HTMLOListElement>("ol.lesson-steps li")];
  const copy = lesson.querySelector<HTMLElement>(".lesson-copy");
  const count = lesson.querySelector<HTMLElement>(".lesson-count");
  const back = lesson.querySelector<HTMLButtonElement>('[data-act="prev"]');
  const next = lesson.querySelector<HTMLButtonElement>('[data-act="next"]');
  const play = lesson.querySelector<HTMLButtonElement>('[data-act="play"]');
  if (!copy || !count || !back || !next || !play || steps.length === 0) return;

  let current = 0;
  let timer: number | undefined;

  const stop = (): void => {
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
    play.textContent = current === steps.length - 1 ? "Replay" : "Play steps";
  };

  const show = (index: number): void => {
    current = Math.max(0, Math.min(steps.length - 1, index));
    copy.textContent = `Step ${current + 1}: ${steps[current]?.textContent ?? ""}`;
    count.textContent = `${current + 1} / ${steps.length}`;
    back.disabled = current === 0;
    next.disabled = current === steps.length - 1;
    if (timer === undefined) {
      play.textContent = current === steps.length - 1 ? "Replay" : "Play steps";
    }

    lesson
      .querySelectorAll<HTMLElement>("[data-steps]")
      .forEach((element) => {
        const activeSteps = element.dataset.steps?.split(",") ?? [];
        element.classList.toggle("on", activeSteps.includes(String(current + 1)));
      });
  };

  const start = (): void => {
    if (current === steps.length - 1) show(0);
    play.textContent = "Pause";
    timer = window.setInterval(() => {
      if (current >= steps.length - 1) {
        stop();
        return;
      }
      show(current + 1);
      if (current === steps.length - 1) stop();
    }, 1500);
  };

  back.addEventListener("click", () => {
    stop();
    show(current - 1);
  });
  next.addEventListener("click", () => {
    stop();
    show(current + 1);
  });
  play.addEventListener("click", () => {
    if (timer !== undefined) stop();
    else start();
  });
  show(0);

  const math = lesson.querySelector<HTMLElement>("[data-math]");
  const powerButtons = lesson.querySelectorAll<HTMLButtonElement>("[data-power]");
  if (math) {
    const updateMath = (power: string): void => {
      const needed = power === "6" ? 1 : 2;
      const after = needed === 1 ? 7 : 9;
      math.textContent = `${power}k attack → rest ${needed} active DON!! (+${needed * 2}k) → Luffy is ${after}k. Enough to stop this attack, before counters or other modifiers. Condition: DON!!×1 attached and 5 or fewer active DON!!. This ability can be used again in another battle.`;
    };
    powerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        powerButtons.forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
        updateMath(button.dataset.power ?? "6");
      });
    });
    updateMath("6");
  }
});

const techCards = [...document.querySelectorAll<HTMLElement>("[data-tech-card]")];
const techButtons = document.querySelectorAll<HTMLButtonElement>("[data-tech-filter]");
const techCount = document.querySelector<HTMLElement>("#tech-count");
const techEmpty = document.querySelector<HTMLElement>("#tech-empty");

function filterTech(filter: string): void {
  let shown = 0;
  techCards.forEach((card) => {
    const matches = filter === "all" || (card.dataset.tags ?? "").split(" ").includes(filter);
    card.hidden = !matches;
    if (matches) shown += 1;
  });
  techButtons.forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.techFilter === filter)),
  );
  if (techCount) techCount.textContent = `${shown} of ${techCards.length} cards`;
  if (techEmpty) techEmpty.hidden = shown !== 0;
}

techButtons.forEach((button) => {
  button.addEventListener("click", () => filterTech(button.dataset.techFilter ?? "all"));
});
filterTech("all");

const deck = document.querySelector<HTMLElement>("#deck")?.textContent?.trim() ?? "";
const copyButton = document.querySelector<HTMLButtonElement>("#copy");
const copied = document.querySelector<HTMLElement>("#copied");

copyButton?.addEventListener("click", async () => {
  if (!copied) return;
  try {
    await navigator.clipboard.writeText(deck);
    copied.textContent = "Copied.";
  } catch {
    copied.textContent = "Copy is not available here. Select the list above.";
  }
});

interface TestRow {
  matchup: string;
  going: string;
  result: string;
  engine: string;
  note: string;
}

const logKey = "robin-bangkok-testlog-v1";
const form = document.querySelector<HTMLFormElement>("#log");
const entries = document.querySelector<HTMLElement>("#entries");
const logStatus = document.querySelector<HTMLElement>("#logstatus");
const clearButton = document.querySelector<HTMLButtonElement>("#clear");

function loadRows(): TestRow[] | null {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(logKey) ?? "[]");
    return Array.isArray(saved) ? (saved as TestRow[]) : null;
  } catch {
    return null;
  }
}

function renderRows(): void {
  if (!entries || !form) return;
  const rows = loadRows();
  if (!rows) {
    entries.textContent = "This browser cannot save the test log. The log is disabled.";
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;
    return;
  }
  entries.textContent = rows.length
    ? `${rows.length} game${rows.length === 1 ? "" : "s"} saved locally: ` +
      rows
        .map(
          (row, index) =>
            `${index + 1}. ${row.matchup} / ${row.going} / ${row.result} / Robin + Nami ready? ${row.engine}${row.note ? ` — ${row.note}` : ""}`,
        )
        .join(" · ")
    : "No games logged yet.";
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const rows = loadRows();
  if (!rows || !form) {
    if (logStatus) logStatus.textContent = "This browser cannot save the game. Record it elsewhere.";
    return;
  }
  const values = new FormData(form);
  const row: TestRow = {
    matchup: String(values.get("matchup") ?? ""),
    going: String(values.get("going") ?? ""),
    result: String(values.get("result") ?? ""),
    engine: String(values.get("engine") ?? ""),
    note: String(values.get("note") ?? "").trim(),
  };
  try {
    localStorage.setItem(logKey, JSON.stringify([...rows, row]));
    const note = form.elements.namedItem("note");
    if (note instanceof HTMLTextAreaElement) note.value = "";
    if (logStatus) logStatus.textContent = "Saved in this browser.";
    renderRows();
  } catch {
    if (logStatus) logStatus.textContent = "Could not save the game. Record it elsewhere.";
  }
});

clearButton?.addEventListener("click", () => {
  try {
    localStorage.removeItem(logKey);
    if (logStatus) logStatus.textContent = "Local log cleared.";
    renderRows();
  } catch {
    if (logStatus) logStatus.textContent = "Local storage unavailable.";
  }
});

renderRows();
