"use strict";

const BOX_NUMBERS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];

const CRAPLESS_DISABLED_BETS = new Set(["dontPass", "dontCome", "oddsDontPass"]);

const BET_LABELS = {
  pass: "Pass Line",
  dontPass: "Don't Pass",
  come: "Come",
  dontCome: "Don't Come",
  field: "Field",
  oddsPass: "Pass Odds",
  oddsDontPass: "Don't Pass Odds",
  place4: "Place 4",
  place5: "Place 5",
  place6: "Place 6",
  place8: "Place 8",
  place9: "Place 9",
  place10: "Place 10",
  place2: "Place 2",
  place3: "Place 3",
  place11: "Place 11",
  place12: "Place 12",
  buy2: "Buy 2",
  buy3: "Buy 3",
  buy4: "Buy 4",
  buy5: "Buy 5",
  buy6: "Buy 6",
  buy8: "Buy 8",
  buy9: "Buy 9",
  buy10: "Buy 10",
  buy11: "Buy 11",
  buy12: "Buy 12",
  anySeven: "Any Seven",
  anyCraps: "Any Craps",
  horn: "Horn Bet",
  hard4: "Hard 4",
  hard6: "Hard 6",
  hard8: "Hard 8",
  hard10: "Hard 10",
};

const BET_PAY_TEXT = {
  pass: "1:1",
  dontPass: "1:1 (bar 12)",
  come: "1:1",
  dontCome: "1:1 (bar 12)",
  field: "1:1 (2/12 pay 2:1)",
  oddsPass: "True odds",
  oddsDontPass: "True odds",
  place4: "9:5",
  place5: "7:5",
  place6: "7:6",
  place8: "7:6",
  place9: "7:5",
  place10: "9:5",
  place2: "11:2",
  place3: "11:4",
  place11: "11:4",
  place12: "11:2",
  buy2: "6:1 less 5% vig on win",
  buy3: "3:1 less 5% vig on win",
  buy4: "2:1 less 5% vig on win",
  buy5: "3:2 less 5% vig on win",
  buy6: "6:5 less 5% vig on win",
  buy8: "6:5 less 5% vig on win",
  buy9: "3:2 less 5% vig on win",
  buy10: "2:1 less 5% vig on win",
  buy11: "3:1 less 5% vig on win",
  buy12: "6:1 less 5% vig on win",
  anySeven: "4:1",
  anyCraps: "7:1",
  horn: "2/12 6:1, 3/11 3:1",
  hard4: "7:1",
  hard6: "9:1",
  hard8: "9:1",
  hard10: "7:1",
};

const PLACE_PAY = {
  2: [11, 2],
  3: [11, 4],
  4: [9, 5],
  5: [7, 5],
  6: [7, 6],
  8: [7, 6],
  9: [7, 5],
  10: [9, 5],
  11: [11, 4],
  12: [11, 2],
};

const BUY_PAY = {
  2: [6, 1],
  3: [3, 1],
  4: [2, 1],
  5: [3, 2],
  6: [6, 5],
  8: [6, 5],
  9: [3, 2],
  10: [2, 1],
  11: [3, 1],
  12: [6, 1],
};

const PASS_ODDS_PAY = {
  2: [6, 1],
  3: [3, 1],
  4: [2, 1],
  5: [3, 2],
  6: [6, 5],
  8: [6, 5],
  9: [3, 2],
  10: [2, 1],
  11: [3, 1],
  12: [6, 1],
};

const DONT_ODDS_PAY = {
  4: [1, 2],
  5: [2, 3],
  6: [5, 6],
  8: [5, 6],
  9: [2, 3],
  10: [1, 2],
};

const HARDWAYS = {
  hard4: { total: 4, payout: 7 },
  hard6: { total: 6, payout: 9 },
  hard8: { total: 8, payout: 9 },
  hard10: { total: 10, payout: 7 },
};

const PIP_MAP = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const CHIP_COLORS = [
  "var(--chip-1)",
  "var(--chip-2)",
  "var(--chip-3)",
  "var(--chip-4)",
  "var(--chip-5)",
  "var(--chip-6)",
  "var(--chip-7)",
  "var(--chip-8)",
  "var(--chip-9)",
];

const PLACE_KEYS = [
  ["place2", 2],
  ["place3", 3],
  ["place4", 4],
  ["place5", 5],
  ["place6", 6],
  ["place8", 8],
  ["place9", 9],
  ["place10", 10],
  ["place11", 11],
  ["place12", 12],
];

const BUY_KEYS = [
  ["buy2", 2],
  ["buy3", 3],
  ["buy4", 4],
  ["buy5", 5],
  ["buy6", 6],
  ["buy8", 8],
  ["buy9", 9],
  ["buy10", 10],
  ["buy11", 11],
  ["buy12", 12],
];

const els = {
  machine: document.getElementById("machine"),
  creditDisplay: document.getElementById("credit-display"),
  bankrollDisplay: document.getElementById("bankroll-display"),
  onTableDisplay: document.getElementById("on-table-display"),
  bannerWin: document.getElementById("banner-win"),
  hardwaysTotal: document.getElementById("hardways-total"),

  bankrollInput: document.getElementById("bankroll-input"),
  bankrollSet: document.getElementById("bankroll-set"),
  denomsInput: document.getElementById("denoms-input"),
  denomsSet: document.getElementById("denoms-set"),

  betsOffToggle: document.getElementById("bets-off-toggle"),
  hardwaysToggle: document.getElementById("hardways-off-toggle"),

  undoChip: document.getElementById("undo-chip"),
  clearBets: document.getElementById("clear-bets"),
  rollBtn: document.getElementById("roll-btn"),

  die1: document.getElementById("die-1"),
  die2: document.getElementById("die-2"),
  rollTotal: document.getElementById("roll-total"),
  phasePill: document.getElementById("phase-pill"),
  pointDisplay: document.getElementById("point-display"),

  chipRack: document.getElementById("chip-rack"),
  selectedChip: document.getElementById("selected-chip"),

  activeBets: document.getElementById("active-bets"),
  lastResult: document.getElementById("last-result"),
  stats: document.getElementById("stats"),
  history: document.getElementById("history"),
  comePoints: document.getElementById("come-points"),
  dontComePoints: document.getElementById("dont-come-points"),
  orientationLock: document.getElementById("orientation-lock"),
  orientationContinue: document.getElementById("orientation-continue"),

  zoneAmounts: document.querySelectorAll("[data-zone-amount]"),
  dropZones: document.querySelectorAll(".drop-zone"),
};

function createStats(startingBankroll) {
  const freq = {};
  for (let i = 2; i <= 12; i += 1) freq[i] = 0;

  return {
    rolls: 0,
    naturals: 0,
    craps: 0,
    pointsSet: 0,
    pointsMade: 0,
    sevenOuts: 0,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    highNetWorth: startingBankroll,
    lowNetWorth: startingBankroll,
    frequency: freq,
  };
}

function createBetState() {
  return {
    pass: 0,
    dontPass: 0,
    come: 0,
    dontCome: 0,
    field: 0,
    oddsPass: 0,
    oddsDontPass: 0,
    place4: 0,
    place5: 0,
    place6: 0,
    place8: 0,
    place9: 0,
    place10: 0,
    place2: 0,
    place3: 0,
    place11: 0,
    place12: 0,
    buy2: 0,
    buy3: 0,
    buy4: 0,
    buy5: 0,
    buy6: 0,
    buy8: 0,
    buy9: 0,
    buy10: 0,
    buy11: 0,
    buy12: 0,
    anySeven: 0,
    anyCraps: 0,
    horn: 0,
    hard4: 0,
    hard6: 0,
    hard8: 0,
    hard10: 0,
  };
}

function createPointMap() {
  const map = {};
  BOX_NUMBERS.forEach((num) => {
    map[num] = 0;
  });
  return map;
}

const state = {
  startingBankroll: 1000,
  bankroll: 1000,
  chipDenoms: [1, 5, 25, 100, 500, 1000],
  selectedChip: 5,
  betsWorking: false,
  hardwaysWorking: false,
  phase: "comeout",
  point: null,
  rolling: false,
  bets: createBetState(),
  comePoints: createPointMap(),
  dontComePoints: createPointMap(),
  placementStack: [],
  feed: [{ text: "No roll yet.", type: "neutral" }],
  history: [],
  stats: createStats(1000),
};

let fitRaf = 0;

function getViewportSize() {
  const vv = window.visualViewport;
  if (vv && vv.width > 0 && vv.height > 0) {
    return { width: vv.width, height: vv.height };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

function isMobileLikeDevice() {
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

function isLandscapeOrientation() {
  const vp = getViewportSize();
  return vp.width >= vp.height;
}

function updateOrientationGate() {
  if (!els.orientationLock) return false;

  const locked = isMobileLikeDevice() && !isLandscapeOrientation();
  els.orientationLock.hidden = !locked;
  els.orientationLock.classList.toggle("active", locked);
  els.machine.classList.toggle("orientation-paused", locked);
  return locked;
}

async function requestLandscapeLock() {
  if (screen.orientation && typeof screen.orientation.lock === "function") {
    try {
      await screen.orientation.lock("landscape");
    } catch (_) {
      // Some browsers (notably iOS Safari) do not support locking.
    }
  }
  scheduleFit();
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function money(n) {
  return `$${round2(n).toFixed(2)}`;
}

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function placePayout(num, amt) {
  const [n, d] = PLACE_PAY[num];
  return round2((amt * n) / d);
}

function buyPayout(num, amt) {
  const [n, d] = BUY_PAY[num];
  return round2((amt * n) / d);
}

function passOddsPayout(point, amt) {
  const [n, d] = PASS_ODDS_PAY[point] || [0, 1];
  return round2((amt * n) / d);
}

function dontPassOddsPayout(point, amt) {
  const [n, d] = DONT_ODDS_PAY[point] || [0, 1];
  return round2((amt * n) / d);
}

function addBankroll(amount) {
  state.bankroll = round2(state.bankroll + amount);
  updateNetWorthStats();
}

function addWin(profit) {
  state.stats.totalWon = round2(state.stats.totalWon + profit);
}

function addLoss(loss) {
  state.stats.totalLost = round2(state.stats.totalLost + loss);
  updateNetWorthStats();
}

function getTotalOnTable() {
  let total = 0;
  Object.values(state.bets).forEach((amt) => {
    total += amt;
  });
  Object.values(state.comePoints).forEach((amt) => {
    total += amt;
  });
  Object.values(state.dontComePoints).forEach((amt) => {
    total += amt;
  });
  return round2(total);
}

function getNetWorth() {
  return round2(state.bankroll + getTotalOnTable());
}

function getHardwaysTotal() {
  return round2(state.bets.hard4 + state.bets.hard6 + state.bets.hard8 + state.bets.hard10);
}

function updateNetWorthStats() {
  const netWorth = getNetWorth();
  if (netWorth > state.stats.highNetWorth) state.stats.highNetWorth = netWorth;
  if (netWorth < state.stats.lowNetWorth) state.stats.lowNetWorth = netWorth;
}

function setFeed(messages) {
  state.feed = messages.length ? messages : [{ text: "No action this roll.", type: "neutral" }];
}

function note(text, type = "neutral") {
  setFeed([{ text, type }]);
  renderSummary();
}

function setupDice() {
  [els.die1, els.die2].forEach((dieEl) => {
    dieEl.innerHTML = "";
    for (let i = 0; i < 9; i += 1) {
      const pip = document.createElement("span");
      pip.className = "pip";
      dieEl.appendChild(pip);
    }
  });
  renderDie(els.die1, 1);
  renderDie(els.die2, 1);
}

function renderDie(dieEl, value) {
  const show = new Set(PIP_MAP[value] || []);
  const pips = dieEl.querySelectorAll(".pip");
  pips.forEach((pip, idx) => {
    pip.style.opacity = show.has(idx) ? "1" : "0";
  });
}

function parseChipDenoms(raw) {
  const parsed = raw
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
  return [...new Set(parsed)].sort((a, b) => a - b);
}

function compactMoney(n) {
  const v = round2(n);
  if (v >= 1000000) return `$${(v / 1000000).toFixed(v % 1000000 ? 1 : 0)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k`;
  if (Number.isInteger(v)) return `$${v.toFixed(0)}`;
  return `$${v.toFixed(2)}`;
}

function ensureZoneChip(zoneEl) {
  let chip = zoneEl.querySelector(".zone-chip");
  if (!chip) {
    chip = document.createElement("div");
    chip.className = "zone-chip is-hidden";
    zoneEl.appendChild(chip);
  }
  return chip;
}

function renderChips() {
  els.chipRack.innerHTML = "";

  state.chipDenoms.forEach((denom, idx) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip ${state.selectedChip === denom ? "active" : ""}`;
    chip.textContent = `$${denom}`;
    chip.style.background = CHIP_COLORS[idx % CHIP_COLORS.length];
    chip.style.color = idx === 0 || idx === 7 ? "#14181d" : "#fff";
    chip.dataset.value = String(denom);
    chip.draggable = true;

    chip.addEventListener("click", () => {
      state.selectedChip = denom;
      renderChips();
      renderSummary();
    });

    chip.addEventListener("dragstart", (e) => {
      state.selectedChip = denom;
      renderChips();
      renderSummary();
      e.dataTransfer.setData("text/plain", String(denom));
      e.dataTransfer.effectAllowed = "copy";
    });

    els.chipRack.appendChild(chip);
  });
}

function renderBoardAmounts() {
  els.zoneAmounts.forEach((el) => {
    const key = el.dataset.zoneAmount;
    const amt = state.bets[key] || 0;
    el.textContent = money(amt);

    const zoneEl = el.closest("[data-bet]");
    if (!zoneEl) return;

    const chip = ensureZoneChip(zoneEl);
    if (amt > 0) {
      chip.textContent = compactMoney(amt);
      chip.classList.remove("is-hidden");
    } else {
      chip.classList.add("is-hidden");
    }
  });
}

function renderLadders() {
  els.comePoints.innerHTML = "";
  els.dontComePoints.innerHTML = "";

  BOX_NUMBERS.forEach((num) => {
    const comeCell = document.createElement("div");
    comeCell.className = "ladder-cell";
    comeCell.innerHTML = `<span class="num">${num}</span><span class="amt">${money(state.comePoints[num])}</span>`;
    els.comePoints.appendChild(comeCell);

    const dcCell = document.createElement("div");
    dcCell.className = "ladder-cell";
    dcCell.innerHTML = `<span class="num">${num}</span><span class="amt">${money(state.dontComePoints[num])}</span>`;
    els.dontComePoints.appendChild(dcCell);
  });
}

function computePotentialWin(key, amt) {
  if (amt <= 0) return "-";

  if (key === "field") return `${money(amt)} or ${money(amt * 2)} on 2/12`;
  if (key === "oddsPass") return state.point ? money(passOddsPayout(state.point, amt)) : "Needs point";
  if (key === "oddsDontPass") return state.point ? money(dontPassOddsPayout(state.point, amt)) : "Needs point";
  if (key.startsWith("place")) return money(placePayout(Number(key.replace("place", "")), amt));
  if (key.startsWith("buy")) {
    const profit = buyPayout(Number(key.replace("buy", "")), amt);
    const commission = round2(profit * 0.05);
    return `${money(profit - commission)} (vig ${money(commission)})`;
  }
  if (key === "anySeven") return money(amt * 4);
  if (key === "anyCraps") return money(amt * 7);
  if (key === "horn") return `${money(amt * 3)} (3/11) or ${money(amt * 6)} (2/12)`;
  if (key === "hard4" || key === "hard10") return money(amt * 7);
  if (key === "hard6" || key === "hard8") return money(amt * 9);

  return money(amt);
}

function pushActiveBetLine(lines, label, amount, payText, potentialWin) {
  lines.push(
    `<div class="active-bet"><strong>${label}</strong><br>` +
      `Amt: ${money(amount)} | Pay: ${payText} | Win: ${potentialWin}</div>`
  );
}

function renderActiveBets() {
  const lines = [];

  Object.entries(state.bets).forEach(([key, amt]) => {
    if (amt > 0) {
      pushActiveBetLine(lines, BET_LABELS[key], amt, BET_PAY_TEXT[key], computePotentialWin(key, amt));
    }
  });

  BOX_NUMBERS.forEach((num) => {
    const cAmt = state.comePoints[num];
    if (cAmt > 0) pushActiveBetLine(lines, `Come ${num}`, cAmt, "1:1", money(cAmt));

    const dcAmt = state.dontComePoints[num];
    if (dcAmt > 0) pushActiveBetLine(lines, `Don't Come ${num}`, dcAmt, "1:1", money(dcAmt));
  });

  els.activeBets.innerHTML = lines.length ? lines.join("") : `<div class="active-bet">No active bets.</div>`;
}

function renderFeed() {
  els.lastResult.innerHTML = state.feed.map((msg) => `<div class="${msg.type}">${msg.text}</div>`).join("");
}

function statRow(label, value) {
  return `<div class="stat-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderStats() {
  const lines = [];
  const net = round2(getNetWorth() - state.startingBankroll);

  const byRoll = [];
  for (let i = 2; i <= 12; i += 1) byRoll.push(`${i}:${state.stats.frequency[i]}`);

  lines.push(statRow("Rolls", state.stats.rolls));
  lines.push(statRow("Come-out 7s", state.stats.naturals));
  lines.push(statRow("Crapless Points (2/3/11/12)", state.stats.craps));
  lines.push(statRow("Points Set", state.stats.pointsSet));
  lines.push(statRow("Points Made", state.stats.pointsMade));
  lines.push(statRow("Seven Outs", state.stats.sevenOuts));
  lines.push(statRow("Total Wagered", money(state.stats.totalWagered)));
  lines.push(statRow("Total Won", money(state.stats.totalWon)));
  lines.push(statRow("Total Lost", money(state.stats.totalLost)));
  lines.push(statRow("Session P/L", `${net >= 0 ? "+" : ""}${money(net)}`));
  lines.push(statRow("High Net Worth", money(state.stats.highNetWorth)));
  lines.push(statRow("Low Net Worth", money(state.stats.lowNetWorth)));
  lines.push(statRow("Roll Dist", byRoll.join(" ")));

  els.stats.innerHTML = lines.join("");
}

function renderHistory() {
  const dieGlyph = {
    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅",
  };

  els.history.innerHTML = "";

  state.history.forEach((h) => {
    const li = document.createElement("li");
    const phaseText = h.phase === "comeout" ? "CO" : `P${h.point}`;
    li.dataset.total = String(h.total);
    li.innerHTML =
      `<span class="hist-total">${h.total}</span>` +
      `<span class="hist-dice">${dieGlyph[h.d1]}${dieGlyph[h.d2]}</span>` +
      `<span class="hist-meta">${phaseText}</span>`;
    li.title = h.summary;
    els.history.appendChild(li);
  });
}

function renderToggles() {
  els.betsOffToggle.classList.toggle("is-off", !state.betsWorking);
  els.betsOffToggle.classList.toggle("is-on", state.betsWorking);
  els.betsOffToggle.textContent = state.betsWorking ? "BETS ON" : "BETS OFF";

  els.hardwaysToggle.classList.toggle("is-off", !state.hardwaysWorking);
  els.hardwaysToggle.classList.toggle("is-on", state.hardwaysWorking);
  els.hardwaysToggle.textContent = state.hardwaysWorking ? "HARDWAYS ON" : "HARDWAYS OFF";
}

function renderPointPuck() {
  document.querySelectorAll(".point-puck").forEach((el) => el.remove());

  if (state.phase !== "point" || !state.point) return;
  const zone =
    document.querySelector(`.place-zone[data-point="${state.point}"]`) ||
    document.querySelector(".point-box");
  if (!zone) return;

  const puck = document.createElement("div");
  puck.className = "point-puck";
  puck.textContent = "ON";
  zone.appendChild(puck);
}

function renderSummary() {
  renderBoardAmounts();
  renderPointPuck();
  renderLadders();
  renderActiveBets();
  renderFeed();
  renderStats();
  renderHistory();
  renderToggles();

  const pointText = state.phase === "comeout" ? "-" : String(state.point);
  els.phasePill.textContent = state.phase === "comeout" ? "Come Out Roll" : `Point Is ${state.point}`;
  els.pointDisplay.textContent = pointText;
  els.creditDisplay.textContent = money(state.bankroll);
  els.bankrollDisplay.textContent = money(state.bankroll);
  els.onTableDisplay.textContent = money(getTotalOnTable());
  els.hardwaysTotal.textContent = money(getHardwaysTotal());
  els.selectedChip.textContent = money(state.selectedChip);
}

function fitMachineToViewport() {
  if (updateOrientationGate()) return;

  els.machine.style.setProperty("--app-scale", "1");

  const rect = els.machine.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const vp = getViewportSize();
  const scaleX = vp.width / rect.width;
  const scaleY = vp.height / rect.height;
  const scale = Math.min(scaleX, scaleY, 1);

  els.machine.style.setProperty("--app-scale", String(scale));
}

function scheduleFit() {
  if (fitRaf) cancelAnimationFrame(fitRaf);
  fitRaf = requestAnimationFrame(() => {
    fitMachineToViewport();
    fitRaf = 0;
  });
}

function resetGame(newBankroll) {
  state.startingBankroll = round2(newBankroll);
  state.bankroll = round2(newBankroll);
  state.betsWorking = false;
  state.hardwaysWorking = false;
  state.phase = "comeout";
  state.point = null;
  state.rolling = false;
  state.bets = createBetState();
  state.comePoints = createPointMap();
  state.dontComePoints = createPointMap();
  state.placementStack = [];
  state.feed = [{ text: "New session started.", type: "neutral" }];
  state.history = [];
  state.stats = createStats(newBankroll);

  els.bannerWin.textContent = money(0);
  els.rollTotal.textContent = "-";
  renderDie(els.die1, 1);
  renderDie(els.die2, 1);
  renderSummary();
  scheduleFit();
}

function canPlaceBet(zone, amt) {
  if (!(zone in state.bets)) return "Unknown betting zone.";
  if (state.rolling) return "Wait until dice stop rolling.";
  if (!Number.isFinite(amt) || amt <= 0) return "Invalid chip amount.";
  if (state.bankroll < amt) return "Insufficient bankroll.";
  if (CRAPLESS_DISABLED_BETS.has(zone)) return "Don't-side bets are disabled in Crapless.";

  if ((zone === "pass" || zone === "dontPass") && state.phase === "point") {
    return "Line bets are contract bets after a point is set.";
  }

  if ((zone === "come" || zone === "dontCome") && state.phase === "comeout") {
    return "Come and Don't Come bets require an active point.";
  }

  if (zone === "oddsPass") {
    if (state.phase !== "point") return "Pass odds require a point.";
    if (state.bets.pass <= 0) return "Place a Pass Line bet first.";
  }

  if (zone === "oddsDontPass") {
    if (state.phase !== "point") return "Don't Pass odds require a point.";
    if (state.bets.dontPass <= 0) return "Place a Don't Pass bet first.";
  }

  return "";
}

function placeBet(zone, amount) {
  const error = canPlaceBet(zone, amount);
  if (error) {
    note(error, "bad");
    return;
  }

  state.bets[zone] = round2(state.bets[zone] + amount);
  state.bankroll = round2(state.bankroll - amount);
  state.stats.totalWagered = round2(state.stats.totalWagered + amount);
  state.placementStack.push({ zone, amount });
  updateNetWorthStats();

  setFeed([{ text: `Placed ${money(amount)} on ${BET_LABELS[zone]}.`, type: "neutral" }]);
  renderSummary();
}

function isRemovableZone(zone) {
  if (zone === "pass" || zone === "dontPass") return state.phase === "comeout";
  return true;
}

function refundBet(zone, amount) {
  if (!(zone in state.bets) || amount <= 0) return false;
  if (!isRemovableZone(zone)) return false;
  if (state.bets[zone] <= 0) return false;

  const refund = Math.min(state.bets[zone], amount);
  state.bets[zone] = round2(state.bets[zone] - refund);
  state.bankroll = round2(state.bankroll + refund);
  state.stats.totalWagered = Math.max(0, round2(state.stats.totalWagered - refund));
  updateNetWorthStats();
  return true;
}

function undoLastChip() {
  while (state.placementStack.length) {
    const last = state.placementStack.pop();
    if (refundBet(last.zone, last.amount)) {
      setFeed([{ text: `Removed ${money(last.amount)} from ${BET_LABELS[last.zone]}.`, type: "neutral" }]);
      renderSummary();
      return;
    }
  }
  note("No removable chip to undo.", "bad");
}

function clearRemovableBets() {
  let refunded = 0;

  Object.keys(state.bets).forEach((zone) => {
    if (state.bets[zone] > 0 && isRemovableZone(zone)) {
      refunded = round2(refunded + state.bets[zone]);
      state.bets[zone] = 0;
    }
  });

  if (refunded <= 0) {
    note("No removable bets available.", "bad");
    return;
  }

  state.bankroll = round2(state.bankroll + refunded);
  state.stats.totalWagered = Math.max(0, round2(state.stats.totalWagered - refunded));
  updateNetWorthStats();
  state.placementStack = state.placementStack.filter((entry) => !isRemovableZone(entry.zone));

  setFeed([{ text: `Cleared removable bets and refunded ${money(refunded)}.`, type: "neutral" }]);
  renderSummary();
}

function resolveOneRollProps(total, events) {
  const anySeven = state.bets.anySeven;
  if (anySeven > 0) {
    state.bets.anySeven = 0;
    if (total === 7) {
      const profit = round2(anySeven * 4);
      addBankroll(anySeven + profit);
      addWin(profit);
      events.push({ text: `Any Seven wins ${money(profit)}.`, type: "good" });
    } else {
      addLoss(anySeven);
      events.push({ text: `Any Seven loses ${money(anySeven)}.`, type: "bad" });
    }
  }

  const anyCraps = state.bets.anyCraps;
  if (anyCraps > 0) {
    state.bets.anyCraps = 0;
    if (total === 2 || total === 3 || total === 12) {
      const profit = round2(anyCraps * 7);
      addBankroll(anyCraps + profit);
      addWin(profit);
      events.push({ text: `Any Craps wins ${money(profit)}.`, type: "good" });
    } else {
      addLoss(anyCraps);
      events.push({ text: `Any Craps loses ${money(anyCraps)}.`, type: "bad" });
    }
  }

  const horn = state.bets.horn;
  if (horn > 0) {
    state.bets.horn = 0;
    if (total === 2 || total === 12) {
      const profit = round2(horn * 6);
      addBankroll(horn + profit);
      addWin(profit);
      events.push({ text: `Horn wins ${money(profit)} on ${total}.`, type: "good" });
    } else if (total === 3 || total === 11) {
      const profit = round2(horn * 3);
      addBankroll(horn + profit);
      addWin(profit);
      events.push({ text: `Horn wins ${money(profit)} on ${total}.`, type: "good" });
    } else {
      addLoss(horn);
      events.push({ text: `Horn loses ${money(horn)}.`, type: "bad" });
    }
  }
}

function resolveField(total, events) {
  const amt = state.bets.field;
  if (amt <= 0) return;

  state.bets.field = 0;

  if ([2, 3, 4, 9, 10, 11, 12].includes(total)) {
    const mult = total === 2 || total === 12 ? 2 : 1;
    const profit = round2(amt * mult);
    addBankroll(amt + profit);
    addWin(profit);
    events.push({ text: `Field wins ${money(profit)}.`, type: "good" });
  } else {
    addLoss(amt);
    events.push({ text: `Field loses ${money(amt)}.`, type: "bad" });
  }
}

function resolveHardways(d1, d2, total, events) {
  Object.entries(HARDWAYS).forEach(([key, info]) => {
    const amt = state.bets[key];
    if (amt <= 0) return;

    if (total === 7) {
      state.bets[key] = 0;
      addLoss(amt);
      events.push({ text: `${BET_LABELS[key]} loses ${money(amt)} on 7.`, type: "bad" });
      return;
    }

    if (total !== info.total) return;

    if (d1 === d2) {
      const profit = round2(amt * info.payout);
      addBankroll(profit);
      addWin(profit);
      events.push({ text: `${BET_LABELS[key]} wins ${money(profit)} (bet stays).`, type: "good" });
      return;
    }

    state.bets[key] = 0;
    addLoss(amt);
    events.push({ text: `${BET_LABELS[key]} loses ${money(amt)} (easy way).`, type: "bad" });
  });
}

function resolvePlace(total, events) {
  PLACE_KEYS.forEach(([key, num]) => {
    const amt = state.bets[key];
    if (amt <= 0) return;

    if (total === 7) {
      state.bets[key] = 0;
      addLoss(amt);
      events.push({ text: `${BET_LABELS[key]} loses ${money(amt)} on 7.`, type: "bad" });
      return;
    }

    if (total === num) {
      const profit = placePayout(num, amt);
      addBankroll(profit);
      addWin(profit);
      events.push({ text: `${BET_LABELS[key]} wins ${money(profit)} (bet stays).`, type: "good" });
    }
  });
}

function resolveBuy(total, events) {
  BUY_KEYS.forEach(([key, num]) => {
    const amt = state.bets[key];
    if (amt <= 0) return;

    if (total === 7) {
      state.bets[key] = 0;
      addLoss(amt);
      events.push({ text: `${BET_LABELS[key]} loses ${money(amt)} on 7.`, type: "bad" });
      return;
    }

    if (total === num) {
      const trueProfit = buyPayout(num, amt);
      const commission = round2(trueProfit * 0.05);
      const netProfit = round2(trueProfit - commission);
      addBankroll(netProfit);
      addWin(netProfit);
      events.push({
        text: `${BET_LABELS[key]} wins ${money(trueProfit)} - ${money(commission)} vig = ${money(netProfit)} (bet stays).`,
        type: "good",
      });
    }
  });
}

function resolveComeOut(total, events) {
  if (total === 7) state.stats.naturals += 1;
  if ([2, 3, 11, 12].includes(total)) state.stats.craps += 1;

  const passAmt = state.bets.pass;

  if (passAmt > 0) {
    if (total === 7) {
      addBankroll(passAmt);
      addWin(passAmt);
      events.push({ text: `Pass Line wins ${money(passAmt)} (bet stays).`, type: "good" });
      return;
    }
  }

  state.phase = "point";
  state.point = total;
  state.stats.pointsSet += 1;
  events.push({ text: `Point established: ${total} (Crapless).`, type: "neutral" });
}

function resolvePendingCome(total, events) {
  const amt = state.bets.come;
  if (amt <= 0) return;

  if (total === 7) {
    state.bets.come = 0;
    addBankroll(amt * 2);
    addWin(amt);
    events.push({ text: `Come wins ${money(amt)}.`, type: "good" });
    return;
  }

  state.bets.come = 0;
  state.comePoints[total] = round2(state.comePoints[total] + amt);
  events.push({ text: `Come ${money(amt)} moves to ${total}.`, type: "neutral" });
}

function resolvePendingDontCome(total, events) {
  const amt = state.bets.dontCome;
  if (amt <= 0) return;

  if (total === 2 || total === 3) {
    state.bets.dontCome = 0;
    addBankroll(amt * 2);
    addWin(amt);
    events.push({ text: `Don't Come wins ${money(amt)}.`, type: "good" });
    return;
  }

  if (total === 7 || total === 11) {
    state.bets.dontCome = 0;
    addLoss(amt);
    events.push({ text: `Don't Come loses ${money(amt)}.`, type: "bad" });
    return;
  }

  if (total === 12) {
    events.push({ text: "Don't Come pushes on 12.", type: "neutral" });
    return;
  }

  state.bets.dontCome = 0;
  state.dontComePoints[total] = round2(state.dontComePoints[total] + amt);
  events.push({ text: `Don't Come ${money(amt)} travels behind ${total}.`, type: "neutral" });
}

function resolveComePoints(total, events) {
  BOX_NUMBERS.forEach((num) => {
    const amt = state.comePoints[num];
    if (amt <= 0) return;

    if (total === num) {
      state.comePoints[num] = 0;
      addBankroll(amt * 2);
      addWin(amt);
      events.push({ text: `Come ${num} wins ${money(amt)}.`, type: "good" });
      return;
    }

    if (total === 7) {
      state.comePoints[num] = 0;
      addLoss(amt);
      events.push({ text: `Come ${num} loses ${money(amt)} on 7-out.`, type: "bad" });
    }
  });
}

function resolveDontComePoints(total, events) {
  BOX_NUMBERS.forEach((num) => {
    const amt = state.dontComePoints[num];
    if (amt <= 0) return;

    if (total === 7) {
      state.dontComePoints[num] = 0;
      addBankroll(amt * 2);
      addWin(amt);
      events.push({ text: `Don't Come ${num} wins ${money(amt)} on 7-out.`, type: "good" });
      return;
    }

    if (total === num) {
      state.dontComePoints[num] = 0;
      addLoss(amt);
      events.push({ text: `Don't Come ${num} loses ${money(amt)}.`, type: "bad" });
    }
  });
}

function resolveSevenOut(events, pointBefore) {
  state.stats.sevenOuts += 1;

  if (state.bets.pass > 0) {
    const amt = state.bets.pass;
    state.bets.pass = 0;
    addLoss(amt);
    events.push({ text: `Pass Line loses ${money(amt)} on 7-out.`, type: "bad" });
  }

  if (state.bets.dontPass > 0) {
    const amt = state.bets.dontPass;
    addBankroll(amt);
    addWin(amt);
    events.push({ text: `Don't Pass wins ${money(amt)} (bet stays).`, type: "good" });
  }

  if (state.bets.oddsPass > 0) {
    const amt = state.bets.oddsPass;
    state.bets.oddsPass = 0;
    addLoss(amt);
    events.push({ text: `Pass Odds lose ${money(amt)}.`, type: "bad" });
  }

  if (state.bets.oddsDontPass > 0) {
    const amt = state.bets.oddsDontPass;
    const profit = dontPassOddsPayout(pointBefore, amt);
    state.bets.oddsDontPass = 0;
    addBankroll(amt + profit);
    addWin(profit);
    events.push({ text: `Don't Pass Odds win ${money(profit)}.`, type: "good" });
  }

  state.phase = "comeout";
  state.point = null;
  events.push({ text: "Seven out. New come out roll.", type: "neutral" });
}

function resolvePointMade(events, pointBefore) {
  state.stats.pointsMade += 1;

  if (state.bets.pass > 0) {
    const amt = state.bets.pass;
    addBankroll(amt);
    addWin(amt);
    events.push({ text: `Pass Line wins ${money(amt)} (bet stays).`, type: "good" });
  }

  if (state.bets.dontPass > 0) {
    const amt = state.bets.dontPass;
    state.bets.dontPass = 0;
    addLoss(amt);
    events.push({ text: `Don't Pass loses ${money(amt)}.`, type: "bad" });
  }

  if (state.bets.oddsPass > 0) {
    const amt = state.bets.oddsPass;
    const profit = passOddsPayout(pointBefore, amt);
    state.bets.oddsPass = 0;
    addBankroll(amt + profit);
    addWin(profit);
    events.push({ text: `Pass Odds win ${money(profit)}.`, type: "good" });
  }

  if (state.bets.oddsDontPass > 0) {
    const amt = state.bets.oddsDontPass;
    state.bets.oddsDontPass = 0;
    addLoss(amt);
    events.push({ text: `Don't Pass Odds lose ${money(amt)}.`, type: "bad" });
  }

  state.phase = "comeout";
  state.point = null;
  events.push({ text: `Point ${pointBefore} made. New come out roll.`, type: "neutral" });
}

function processRoll(d1, d2) {
  const total = d1 + d2;
  const phaseBefore = state.phase;
  const pointBefore = state.point;
  const events = [];

  const placeWorking = phaseBefore === "point" || state.betsWorking;
  const hardwaysWorking = phaseBefore === "point" || state.hardwaysWorking;

  state.stats.rolls += 1;
  state.stats.frequency[total] += 1;

  resolveOneRollProps(total, events);
  resolveField(total, events);

  if (placeWorking) resolvePlace(total, events);
  if (placeWorking) resolveBuy(total, events);
  if (hardwaysWorking) resolveHardways(d1, d2, total, events);

  if (phaseBefore === "comeout") {
    resolveComeOut(total, events);
  } else {
    resolvePendingCome(total, events);
    resolvePendingDontCome(total, events);
    resolveComePoints(total, events);
    resolveDontComePoints(total, events);

    if (total === 7) {
      resolveSevenOut(events, pointBefore);
    } else if (total === pointBefore) {
      resolvePointMade(events, pointBefore);
    }
  }

  if (!placeWorking && phaseBefore === "comeout" && getPlaceBetTotal() > 0) {
    events.push({ text: "Place/Buy bets were OFF for the come out roll.", type: "neutral" });
  }

  if (!hardwaysWorking && phaseBefore === "comeout" && getHardwaysTotal() > 0) {
    events.push({ text: "Hardways were OFF for the come out roll.", type: "neutral" });
  }

  if (events.length === 0) events.push({ text: "No bets were resolved.", type: "neutral" });

  state.placementStack = [];
  setFeed(events);

  const summaryText = events
    .slice(0, 2)
    .map((e) => e.text.replace(/\.$/, ""))
    .join(" | ");

  state.history.unshift({
    d1,
    d2,
    total,
    phase: phaseBefore,
    point: pointBefore ?? "-",
    summary: summaryText || "No action",
  });

  state.history = state.history.slice(0, 20);
}

function getPlaceBetTotal() {
  let total = 0;
  PLACE_KEYS.forEach(([key]) => {
    total += state.bets[key];
  });
  BUY_KEYS.forEach(([key]) => {
    total += state.bets[key];
  });
  return round2(total);
}

function animateDice(final1, final2) {
  return new Promise((resolve) => {
    let ticks = 0;
    els.die1.classList.add("rolling");
    els.die2.classList.add("rolling");

    const timer = setInterval(() => {
      renderDie(els.die1, randomDie());
      renderDie(els.die2, randomDie());
      ticks += 1;

      if (ticks >= 12) {
        clearInterval(timer);
        els.die1.classList.remove("rolling");
        els.die2.classList.remove("rolling");
        renderDie(els.die1, final1);
        renderDie(els.die2, final2);
        resolve();
      }
    }, 80);
  });
}

async function rollDice() {
  if (updateOrientationGate()) return;
  if (state.rolling) return;

  state.rolling = true;
  els.machine.classList.add("is-rolling");
  els.rollBtn.disabled = true;
  els.rollBtn.textContent = "Rolling";
  els.undoChip.disabled = true;
  els.clearBets.disabled = true;

  const d1 = randomDie();
  const d2 = randomDie();
  const bankrollBefore = state.bankroll;

  await animateDice(d1, d2);
  const total = d1 + d2;

  els.rollTotal.textContent = String(total);
  processRoll(d1, d2);

  const bankrollDelta = round2(state.bankroll - bankrollBefore);
  els.bannerWin.textContent = money(Math.max(0, bankrollDelta));

  renderSummary();

  state.rolling = false;
  els.machine.classList.remove("is-rolling");
  els.rollBtn.disabled = false;
  els.rollBtn.textContent = "Roll Dice";
  els.undoChip.disabled = false;
  els.clearBets.disabled = false;
}

function attachEvents() {
  els.bankrollSet.addEventListener("click", () => {
    const value = Number(els.bankrollInput.value);
    if (!Number.isFinite(value) || value <= 0) {
      note("Bankroll must be a positive number.", "bad");
      return;
    }
    resetGame(value);
  });

  els.denomsSet.addEventListener("click", () => {
    const parsed = parseChipDenoms(els.denomsInput.value);
    if (!parsed.length) {
      note("Provide valid chip denominations (example: 1,5,25,100).", "bad");
      return;
    }

    state.chipDenoms = parsed;
    if (!state.chipDenoms.includes(state.selectedChip)) {
      state.selectedChip = state.chipDenoms[0];
    }

    renderChips();
    renderSummary();
  });

  els.betsOffToggle.addEventListener("click", () => {
    state.betsWorking = !state.betsWorking;
    note(`Place/Buy bets are now ${state.betsWorking ? "ON" : "OFF"} for come out rolls.`);
  });

  els.hardwaysToggle.addEventListener("click", () => {
    state.hardwaysWorking = !state.hardwaysWorking;
    note(`Hardways are now ${state.hardwaysWorking ? "ON" : "OFF"} for come out rolls.`);
  });

  els.undoChip.addEventListener("click", undoLastChip);
  els.clearBets.addEventListener("click", clearRemovableBets);
  els.rollBtn.addEventListener("click", rollDice);
  window.addEventListener("resize", scheduleFit);
  window.addEventListener("orientationchange", scheduleFit);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleFit);
    window.visualViewport.addEventListener("scroll", scheduleFit);
  }
  if (els.orientationContinue) {
    els.orientationContinue.addEventListener("click", requestLandscapeLock);
  }

  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" || e.repeat) return;

    const target = e.target;
    const tagName = target && target.tagName ? target.tagName.toUpperCase() : "";
    const isTypingTarget =
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      (target && target.isContentEditable);

    if (isTypingTarget) return;

    e.preventDefault();
    rollDice();
  });

  els.dropZones.forEach((zone) => {
    zone.addEventListener("click", (e) => {
      e.stopPropagation();
      placeBet(zone.dataset.bet, state.selectedChip);
    });

    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add("drag-target");
      e.dataTransfer.dropEffect = "copy";
    });

    zone.addEventListener("dragleave", (e) => {
      e.stopPropagation();
      zone.classList.remove("drag-target");
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove("drag-target");
      const dragged = Number(e.dataTransfer.getData("text/plain"));
      const chip = Number.isFinite(dragged) && dragged > 0 ? dragged : state.selectedChip;
      placeBet(zone.dataset.bet, chip);
    });
  });
}

function init() {
  setupDice();
  attachEvents();
  renderChips();
  resetGame(Number(els.bankrollInput.value) || 1000);
  updateOrientationGate();
  scheduleFit();
}

init();
