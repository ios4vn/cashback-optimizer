// ===== Storage Keys =====
const KEYS = {
    myCards: 'cb_my_cards',
    transactions: 'cb_transactions',
    currentMonth: 'cb_current_month',
};

// ===== State =====
let allCards = [];
let allCardsMap = {};
let categories = [];
let catMap = {};
let editingTxId = null;

// ===== Helpers =====
function fmt(n) { return new Intl.NumberFormat('vi-VN').format(Math.round(n)); }
function parseNum(s) {
    s = String(s).trim().toLowerCase().replace(/,/g, '').replace(/\./g, '');
    // Support "500k" → 500000, "2tr" or "2m" → 2000000
    let m;
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*k$/))) return Math.round(parseFloat(m[1]) * 1000);
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*(?:tr|m|triệu|trieu)$/))) return Math.round(parseFloat(m[1]) * 1000000);
    return parseInt(s.replace(/[^\d]/g, ''), 10) || 0;
}
function getCurrentMonth() { return new Date().toISOString().slice(0, 7); }
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getMyCards() { return load(KEYS.myCards, []); }
function setMyCards(ids) { save(KEYS.myCards, ids); }
function getTransactions() { return load(KEYS.transactions, []); }
function setTransactions(txs) { save(KEYS.transactions, txs); }

// Calculate month_usage from transactions
function calcMonthUsage() {
    const txs = getTransactions();
    const usage = {}; // {card_id: {category: cashback_amount}}
    for (const tx of txs) {
        if (!usage[tx.card_id]) usage[tx.card_id] = {};
        usage[tx.card_id][tx.category] = (usage[tx.card_id][tx.category] || 0) + tx.cashback;
    }
    return usage;
}

// Check & reset month
function checkMonthReset() {
    const stored = localStorage.getItem(KEYS.currentMonth);
    const current = getCurrentMonth();
    if (stored && stored !== current) {
        // Archive old transactions
        const oldTxs = getTransactions();
        if (oldTxs.length > 0) {
            save('cb_archive_' + stored, oldTxs);
        }
        setTransactions([]);
        showToast('🗓️ Tháng mới! Cap đã reset.');
    }
    localStorage.setItem(KEYS.currentMonth, current);
}

// Toast
function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 2500);
}

// ===== Navigation =====
function switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    document.querySelector(`.nav-tab[data-tab="${name}"]`).classList.add('active');
    if (name === 'history') renderHistory();
    if (name === 'mycards') renderMyCards();
    if (name === 'compare') renderCompare();
}

document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ===== Format input =====
document.querySelectorAll('input[inputmode="numeric"]').forEach(input => {
    input.addEventListener('input', function() {
        const raw = this.value.replace(/[^\d]/g, '');
        this.value = raw ? fmt(parseInt(raw)) : '';
    });
});

// ===== Recommend =====
document.getElementById('btn-recommend').addEventListener('click', doRecommend);
document.getElementById('rec-amount').addEventListener('keydown', e => {
    if (e.key === 'Enter') doRecommend();
});

async function doRecommend() {
    const amount = parseNum(document.getElementById('rec-amount').value);
    const category = document.getElementById('rec-category').value;
    const myCards = getMyCards();

    if (!amount) { showToast('Nhập số tiền!'); return; }
    if (myCards.length === 0) {
        document.getElementById('rec-results').classList.add('hidden');
        document.getElementById('no-cards-warning').classList.remove('hidden');
        return;
    }
    document.getElementById('no-cards-warning').classList.add('hidden');

    const monthUsage = calcMonthUsage();
    const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, category, my_cards: myCards, month_usage: monthUsage })
    });
    const data = await res.json();
    renderRecommendations(data.recommendations, amount, category);
}

function renderRecommendations(recs, amount, category) {
    const container = document.getElementById('rec-list');
    const catLabel = catMap[category] || category;

    if (recs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Không tìm thấy thẻ phù hợp.</p></div>';
        document.getElementById('rec-results').classList.remove('hidden');
        return;
    }

    container.innerHTML = recs.map((r, i) => {
        const isBest = i === 0 && r.cashback > 0;
        const capPct = r.is_unlimited ? 0 : (r.cap_total > 0 ? ((r.cap_used) / r.cap_total * 100) : 0);
        const capClass = capPct >= 100 ? 'full' : capPct >= 80 ? 'warn' : '';
        const card = allCardsMap[r.card_id];

        return `
        <div class="rec-card ${isBest ? 'best' : ''}">
            <div class="rec-card-header">
                <div style="display:flex;gap:0.75rem;align-items:flex-start">
                    ${card ? cardVisual(card) : ''}
                    <div>
                        ${isBest ? '<span class="badge-best">TỐT NHẤT</span> ' : ''}
                        <div class="rec-card-name">${r.card_name}</div>
                        <div class="rec-card-bank">${r.bank}</div>
                    </div>
                </div>
                <div>
                    <div class="rec-cashback">${r.cashback > 0 ? '+' + fmt(r.cashback) + 'đ' : '0đ'}</div>
                    <div class="rec-rate">${r.rate}% cashback</div>
                </div>
            </div>
            ${r.is_unlimited ? `<div class="badge-unlimited">♾️ Không giới hạn cap</div>` : r.cap_total > 0 ? `
            <div class="rec-cap">
                <div class="rec-cap-label">
                    <span>Cap đã dùng</span>
                    <span>${fmt(r.cap_used)}đ / ${fmt(r.cap_total)}đ</span>
                </div>
                <div class="cap-bar"><div class="cap-bar-fill ${capClass}" style="width:${Math.min(capPct, 100)}%"></div></div>
            </div>` : ''}
            <div class="rec-card-actions">
                <button class="btn btn-confirm" onclick="confirmCard('${r.card_id}', ${amount}, '${category}', ${r.cashback})">
                    Dùng thẻ này ✓
                </button>
            </div>
        </div>`;
    }).join('');

    document.getElementById('rec-results').classList.remove('hidden');
}

function confirmCard(cardId, amount, category, cashback) {
    const tx = {
        id: genId(),
        card_id: cardId,
        category: category,
        amount: amount,
        cashback: cashback,
        date: new Date().toISOString(),
    };
    const txs = getTransactions();
    txs.unshift(tx);
    setTransactions(txs);

    const card = allCardsMap[cardId];
    showToast(`✅ Đã ghi! ${card ? card.name : cardId} +${fmt(cashback)}đ`);

    // Reset form
    document.getElementById('rec-amount').value = '';
    document.getElementById('rec-results').classList.add('hidden');
}

// ===== History =====
function renderHistory() {
    const txs = getTransactions();
    const myCards = getMyCards();

    // Dashboard summary
    const totalSpend = txs.reduce((s, t) => s + t.amount, 0);
    const totalCashback = txs.reduce((s, t) => s + t.cashback, 0);
    document.getElementById('dashboard-summary').innerHTML = `
        <div class="summary-card"><div class="label">Chi tiêu</div><div class="value">${fmt(totalSpend)}đ</div></div>
        <div class="summary-card"><div class="label">Cashback</div><div class="value green">${fmt(totalCashback)}đ</div></div>
        <div class="summary-card"><div class="label">Giao dịch</div><div class="value">${txs.length}</div></div>
    `;

    // Cap tracker
    renderCapTracker(myCards);

    // Transaction list
    const listEl = document.getElementById('tx-list');
    const emptyEl = document.getElementById('tx-empty');
    if (txs.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }
    emptyEl.classList.add('hidden');
    listEl.innerHTML = txs.map(tx => {
        const card = allCardsMap[tx.card_id];
        const catLabel = catMap[tx.category] || tx.category;
        const d = new Date(tx.date);
        const dateStr = d.getDate() + '/' + (d.getMonth() + 1);
        return `
        <div class="tx-item">
            <div class="tx-left">
                <div class="tx-cat">${catLabel}</div>
                <div class="tx-meta">${card ? card.name : tx.card_id} · ${dateStr}</div>
            </div>
            <div class="tx-right">
                <div class="tx-amount">${fmt(tx.amount)}đ</div>
                <div class="tx-cashback">+${fmt(tx.cashback)}đ</div>
            </div>
            <div class="tx-actions">
                <button class="tx-btn" onclick="editTx('${tx.id}')" title="Sửa">✏️</button>
                <button class="tx-btn delete" onclick="deleteTx('${tx.id}')" title="Xóa">🗑️</button>
            </div>
        </div>`;
    }).join('');
}

function renderCapTracker(myCards) {
    const usage = calcMonthUsage();
    let html = '';
    for (const cardId of myCards) {
        const card = allCardsMap[cardId];
        if (!card) continue;
        const rules = card.cashback_rules.filter(r => r.cap_monthly);
        if (rules.length === 0) continue;
        let capsHtml = rules.map(r => {
            const used = (usage[cardId] && usage[cardId][r.category]) || 0;
            const pct = Math.min(used / r.cap_monthly * 100, 100);
            const cls = pct >= 100 ? 'full' : pct >= 80 ? 'warn' : '';
            return `<div class="cap-item-cat">${r.label}: ${fmt(used)}đ / ${fmt(r.cap_monthly)}đ
                <div class="cap-bar"><div class="cap-bar-fill ${cls}" style="width:${pct}%"></div></div></div>`;
        }).join('');
        html += `<div class="cap-item"><div class="cap-item-header"><strong>${card.name}</strong><span>${card.bank}</span></div>${capsHtml}</div>`;
    }
    document.getElementById('cap-tracker').innerHTML = html ? `<div class="cap-section"><h3>📊 Cap còn lại</h3>${html}</div>` : '';
}

function deleteTx(id) {
    if (!confirm('Xóa giao dịch này?')) return;
    const txs = getTransactions().filter(t => t.id !== id);
    setTransactions(txs);
    renderHistory();
    showToast('Đã xóa giao dịch');
}

function editTx(id) {
    const tx = getTransactions().find(t => t.id === id);
    if (!tx) return;
    editingTxId = id;
    document.getElementById('modal-add-title').textContent = 'Sửa giao dịch';
    document.getElementById('manual-amount').value = fmt(tx.amount);
    document.getElementById('manual-category').value = tx.category;
    populateCardSelect();
    document.getElementById('manual-card').value = tx.card_id;
    document.getElementById('modal-add').classList.remove('hidden');
}

// ===== Manual Add =====
document.getElementById('btn-add-manual').addEventListener('click', () => {
    editingTxId = null;
    document.getElementById('modal-add-title').textContent = 'Thêm giao dịch';
    document.getElementById('manual-amount').value = '';
    document.getElementById('manual-category').value = 'dining';
    populateCardSelect();
    document.getElementById('modal-add').classList.remove('hidden');
});

document.getElementById('manual-amount').addEventListener('input', function() {
    const raw = this.value.replace(/[^\d]/g, '');
    this.value = raw ? fmt(parseInt(raw)) : '';
});

function populateCardSelect() {
    const myCards = getMyCards();
    const sel = document.getElementById('manual-card');
    sel.innerHTML = myCards.map(id => {
        const c = allCardsMap[id];
        return c ? `<option value="${id}">${c.name} (${c.bank})</option>` : '';
    }).join('');
}

function closeModal() { document.getElementById('modal-add').classList.add('hidden'); }

document.getElementById('btn-save-manual').addEventListener('click', () => {
    const amount = parseNum(document.getElementById('manual-amount').value);
    const category = document.getElementById('manual-category').value;
    const cardId = document.getElementById('manual-card').value;
    if (!amount || !cardId) { showToast('Nhập đầy đủ thông tin!'); return; }

    // Calculate cashback for this manual entry
    const card = allCardsMap[cardId];
    let cashback = 0;
    if (card) {
        let rate = 0;
        let rule = card.cashback_rules.find(r => r.category === category);
        if (!rule) rule = card.cashback_rules.find(r => r.category === 'other');
        if (rule) {
            rate = rule.rate;
            cashback = Math.round(amount * rate / 100);
            if (rule.cap_monthly) {
                const usage = calcMonthUsage();
                const used = (usage[cardId] && usage[cardId][category]) || 0;
                cashback = Math.min(cashback, Math.max(0, rule.cap_monthly - used));
            }
        }
    }

    const txs = getTransactions();
    if (editingTxId) {
        const idx = txs.findIndex(t => t.id === editingTxId);
        if (idx >= 0) txs[idx] = { ...txs[idx], amount, category, card_id: cardId, cashback };
    } else {
        txs.unshift({ id: genId(), card_id: cardId, category, amount, cashback, date: new Date().toISOString() });
    }
    setTransactions(txs);
    closeModal();
    renderHistory();
    showToast(editingTxId ? 'Đã cập nhật!' : 'Đã thêm giao dịch!');
});

// ===== My Cards =====
function cardVisual(card) {
    const color = card.color || '#333';
    if (card.image) {
        return `<img class="card-visual-img" src="${card.image}" alt="${card.bank} ${card.name}" loading="lazy">`;
    }
    return `<div class="card-visual" style="background:linear-gradient(135deg, ${color}, ${color}dd)">
        <div class="cv-bank">${card.bank}</div>
        <div class="cv-chip"></div>
        <div class="cv-network">${card.network}</div>
    </div>`;
}

function renderMyCards(filter = '') {
    const selected = getMyCards();
    const q = filter.toLowerCase();
    const filtered = q ? allCards.filter(c =>
        c.bank.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.network.toLowerCase().includes(q)
    ) : allCards;
    document.getElementById('card-grid').innerHTML = filtered.map(card => {
        const isSelected = selected.includes(card.id);
        const rates = card.cashback_rules.filter(r => r.category !== 'other')
            .map(r => `<span class="rate-tag">${r.label} ${r.rate}%</span>`).join('');
        return `
        <label class="card-item ${isSelected ? 'selected' : ''}" data-id="${card.id}">
            <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleCard('${card.id}', this.checked)">
            ${cardVisual(card)}
            <div class="card-info">
                <div class="card-bank">${card.bank}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-detail">${card.network} ${card.tier} · ${card.annual_fee === 0 ? 'Miễn phí' : fmt(card.annual_fee) + 'đ/năm'}</div>
                <div class="card-rates">${rates}</div>
            </div>
        </label>`;
    }).join('');
}

function toggleCard(id, checked) {
    let cards = getMyCards();
    if (checked && !cards.includes(id)) cards.push(id);
    else cards = cards.filter(c => c !== id);
    setMyCards(cards);
    const q = document.getElementById('card-search')?.value || '';
    renderMyCards(q);
}

document.getElementById('card-search')?.addEventListener('input', function() {
    renderMyCards(this.value);
});

// ===== Compare =====
function renderCompare() {
    document.querySelector('#compare-table tbody').innerHTML = allCards.map(card => {
        const rates = card.cashback_rules.filter(r => r.category !== 'other')
            .map(r => `<span class="rate-tag">${r.label} ${r.rate}%</span>`).join('');
        const fee = card.annual_fee === 0 ? '<span class="badge-free">Miễn phí</span>' : fmt(card.annual_fee) + 'đ';
        return `<tr>
            <td style="display:flex;gap:0.5rem;align-items:center">${cardVisual(card)}<div><strong>${card.name}</strong><br><small style="color:var(--text2)">${card.bank} · ${card.network}</small></div></td>
            <td>${fee}</td>
            <td>${rates}</td>
            <td><a href="/card/${card.id}" class="link">Xem →</a></td>
        </tr>`;
    }).join('');
}

// ===== Init =====
async function init() {
    checkMonthReset();
    const [cardsRes, catsRes] = await Promise.all([fetch('/api/cards'), fetch('/api/categories')]);
    allCards = await cardsRes.json();
    categories = await catsRes.json();
    allCardsMap = {};
    allCards.forEach(c => allCardsMap[c.id] = c);
    catMap = {};
    categories.forEach(c => catMap[c.id] = c.label);
}

// ===== Quick Amounts =====
document.querySelectorAll('.chip[data-amount]').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById('rec-amount');
        input.value = fmt(parseInt(btn.dataset.amount));
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== PWA Install =====
let deferredPrompt = null;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

function showInstallBanner() {
    if (!isStandalone && !localStorage.getItem('cb_dismiss_install')) {
        document.getElementById('install-banner').classList.remove('hidden');
    }
}

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
});

// Show banner on iOS/other browsers too (after short delay)
setTimeout(() => { if (!deferredPrompt) showInstallBanner(); }, 2000);

document.getElementById('btn-install')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        document.getElementById('install-banner').classList.add('hidden');
    } else {
        // iOS / other browsers — show instructions
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            alert('Trên Safari:\n1. Nhấn nút Chia sẻ (⬆️) ở thanh dưới\n2. Kéo xuống chọn "Thêm vào Màn hình chính"');
        } else {
            alert('Trên trình duyệt:\n1. Nhấn menu ⋮ (3 chấm) góc trên phải\n2. Chọn "Thêm vào Màn hình chính" hoặc "Install app"');
        }
    }
});

document.getElementById('btn-dismiss-install')?.addEventListener('click', () => {
    document.getElementById('install-banner').classList.add('hidden');
    localStorage.setItem('cb_dismiss_install', '1');
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/sw.js');
}

init();
