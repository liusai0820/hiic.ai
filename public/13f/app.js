const state = {
  view: "q1",
  query: "",
  selectedSlug: "",
};

const data = window.SMART_MONEY_DATA;
const moneyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

function money(value) {
  return `$${moneyFormatter.format(value)}`;
}

function pct(value) {
  if (value === null || value === undefined) return "新进";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(1)}%`;
}

function shortIssuer(name) {
  return name
    .replace(/\s+(INC|CORP|CORPORATION|CO|LTD|PLC|NEW)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function activeItems() {
  return data[state.view].filter((item) => {
    const haystack = `${item.managerName} ${item.firmName} ${item.hook} ${
      item.topHoldings?.map((holding) => `${holding.ticker} ${holding.issuer}`).join(" ") || ""
    }`.toLowerCase();
    return haystack.includes(state.query.toLowerCase());
  });
}

function okItems(view = state.view) {
  return data[view].filter((item) => item.status === "ok");
}

function firstAvailable(items) {
  return items.find((item) => item.status === "ok") || items[0] || null;
}

function setSelected(slug) {
  state.selectedSlug = slug;
  renderManagerGrid();
  renderDetail();
}

function renderHero() {
  const q1Ok = data.meta.q1OkCount;
  const q1Total = data.meta.q1TotalCount;
  const pctComplete = q1Total ? (q1Ok / q1Total) * 100 : 0;
  document.querySelector("#q1-progress").textContent = `${q1Ok} / ${q1Total}`;
  document.querySelector("#q1-progress-bar").style.width = `${pctComplete}%`;
  document.querySelector("#metric-q1").textContent = `${q1Ok}/${q1Total}`;
  document.querySelector("#metric-latest").textContent = `${data.meta.latestOkCount}/${data.meta.latestTotalCount}`;

  const rows = data.q1.slice(0, 8).map((item) => {
    const statusClass = item.status === "ok" ? "status-ok" : "status-missing";
    const statusText = item.status === "ok" ? "已披露" : "等待";
    const dateText = item.status === "ok" ? item.filingDate : item.requestedReportDate;
    return `
      <div class="filing-row">
        <div>
          <strong>${item.managerName}</strong>
          <span>${item.publicTag || item.firmName} · ${dateText || "2026-03-31"}</span>
        </div>
        <em class="status-pill ${statusClass}">${statusText}</em>
      </div>
    `;
  });
  document.querySelector("#filing-ticker").innerHTML = rows.join("");
}

function renderManagerGrid() {
  const items = activeItems();
  const html = items
    .map((item) => {
      const active = item.slug === state.selectedSlug ? "active" : "";
      const statusClass = item.status === "ok" ? "status-ok" : "status-missing";
      const statusText = item.status === "ok" ? "已披露" : "待披露";
      const report = item.status === "ok" ? item.reportDate : item.requestedReportDate || "2026-03-31";
      const value = item.status === "ok" ? money(item.totalMarketValueUsd) : "未披露";
      return `
        <button class="manager-card ${active}" type="button" data-slug="${item.slug}">
          <div class="manager-topline">
            <h3>${item.managerName}</h3>
            <span class="status-pill ${statusClass}">${statusText}</span>
          </div>
          <p class="manager-tag">${item.publicTag || item.hook || item.firmName}</p>
          <p class="manager-reason">${item.publicReason || item.firmName}</p>
          <div class="manager-meta">
            <span class="mini-chip">${report}</span>
            <span class="mini-chip">${value}</span>
          </div>
        </button>
      `;
    })
    .join("");
  document.querySelector("#manager-grid").innerHTML = html || `<p class="empty">没有匹配的基金经理。</p>`;
  document.querySelectorAll(".manager-card").forEach((card) => {
    card.addEventListener("click", () => setSelected(card.dataset.slug));
  });
}

function changeClass(value) {
  if (value === null || value === undefined) return "neutral";
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function renderDetail() {
  const items = activeItems();
  let item = items.find((entry) => entry.slug === state.selectedSlug);
  if (!item) {
    item = firstAvailable(items);
    state.selectedSlug = item?.slug || "";
  }

  const panel = document.querySelector("#detail-panel");
  if (!item) {
    panel.innerHTML = "<p>暂无数据。</p>";
    return;
  }

  if (item.status !== "ok") {
    panel.innerHTML = `
      <div class="detail-header">
        <div>
          <p class="eyebrow">等待 SEC 披露</p>
          <h3>${item.managerName}</h3>
          <p class="profile-tag">${item.publicTag || item.hook}</p>
          <p>${item.publicReason || item.firmName}</p>
          <p>${item.firmName} 的 ${item.requestedReportDate || "2026-03-31"} 13F 还未在 SEC 披露。</p>
        </div>
        <div class="radial-chart" aria-hidden="true"></div>
      </div>
      <div class="detail-stats">
        <div class="detail-stat"><span>状态</span><strong>等待披露</strong></div>
        <div class="detail-stat"><span>报告期</span><strong>${item.requestedReportDate || "2026-03-31"}</strong></div>
        <div class="detail-stat"><span>数据源</span><strong>SEC</strong></div>
      </div>
    `;
    return;
  }

  const maxWeight = Math.max(...item.topHoldings.map((holding) => holding.weightPct));
  const rows = item.topHoldings
    .map((holding, index) => {
      const width = maxWeight ? Math.max(8, (holding.weightPct / maxWeight) * 100) : 8;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <span class="ticker">${holding.ticker}${holding.putCall ? ` ${holding.putCall}` : ""}</span>
            <span class="issuer">${shortIssuer(holding.issuer)}</span>
          </td>
          <td>
            <div class="weight-bar">
              <strong>${holding.weightPct.toFixed(1)}%</strong>
              <span style="width:${width}%"></span>
            </div>
          </td>
          <td>${money(holding.valueUsd)}</td>
          <td class="${changeClass(holding.sharesChangePct)}">${pct(holding.sharesChangePct)}</td>
          <td>${holding.action}</td>
        </tr>
      `;
    })
    .join("");

  panel.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">${item.reportDate} · Form 13F-HR</p>
        <h3>${item.managerName}</h3>
        <p class="profile-tag">${item.publicTag || item.hook}</p>
        <p>${item.publicReason || item.hook} 披露日 ${item.filingDate}，申报机构为 ${item.firmName}。</p>
      </div>
      <div class="radial-chart" aria-label="前十大权重示意图"></div>
    </div>
    <div class="detail-stats">
      <div class="detail-stat"><span>组合市值</span><strong>${money(item.totalMarketValueUsd)}</strong></div>
      <div class="detail-stat"><span>持仓数</span><strong>${item.positionCount}</strong></div>
      <div class="detail-stat"><span>前十大占比</span><strong>${item.top10WeightPct.toFixed(1)}%</strong></div>
    </div>
    <table class="holding-table">
      <thead>
        <tr>
          <th>#</th>
          <th>代码 / 公司</th>
          <th>组合占比</th>
          <th>市值</th>
          <th>股数变化</th>
          <th>动作</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">查看 SEC 原始 XML · ${item.accessionNumber}</a>
  `;
}

function bindControls() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll("[data-view]").forEach((entry) => entry.classList.toggle("active", entry === button));
      const selected = firstAvailable(activeItems());
      state.selectedSlug = selected?.slug || "";
      renderManagerGrid();
      renderDetail();
    });
  });

  document.querySelector("#manager-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    const selected = firstAvailable(activeItems());
    state.selectedSlug = selected?.slug || "";
    renderManagerGrid();
    renderDetail();
  });
}

function boot() {
  state.selectedSlug = okItems("q1")[0]?.slug || data.q1[0]?.slug || "";
  renderHero();
  renderManagerGrid();
  renderDetail();
  bindControls();
}

boot();
