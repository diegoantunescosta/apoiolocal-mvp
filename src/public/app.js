let currentCategory = 'ALL';
let allDemands = [];
let allPoints = [];

// Elementos DOM
const demandsGrid = document.getElementById('demandsGrid');
const pointsGrid = document.getElementById('pointsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Estatísticas
const statActiveDemands = document.getElementById('statActiveDemands');
const statCompletedDemands = document.getElementById('statCompletedDemands');
const statCollectionPoints = document.getElementById('statCollectionPoints');

// Modal Nova Demanda
const modalDemand = document.getElementById('modalDemand');
const btnOpenNewDemand = document.getElementById('btnOpenNewDemand');
const btnCloseDemandModal = document.getElementById('btnCloseDemandModal');
const btnCancelDemand = document.getElementById('btnCancelDemand');
const formNewDemand = document.getElementById('formNewDemand');

// Modal Doar
const modalDonate = document.getElementById('modalDonate');
const btnCloseDonateModal = document.getElementById('btnCloseDonateModal');
const btnCancelDonate = document.getElementById('btnCancelDonate');
const formDonate = document.getElementById('formDonate');
const donateDemandId = document.getElementById('donateDemandId');
const donateTargetSummary = document.getElementById('donateTargetSummary');
const donateUnitLabel = document.getElementById('donateUnitLabel');
const donatePoint = document.getElementById('donatePoint');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
});

async function loadData() {
  await Promise.all([loadDemands(), loadPoints()]);
  updateStats();
}

async function loadDemands() {
  try {
    const url = currentCategory === 'ALL' ? '/api/demands' : `/api/demands?category=${currentCategory}`;
    const res = await fetch(url);
    allDemands = await res.json();
    renderDemands(allDemands);
  } catch (err) {
    demandsGrid.innerHTML = `<div class="error-state">Não foi possível carregar as demandas. Tente novamente mais tarde.</div>`;
  }
}

async function loadPoints() {
  try {
    const res = await fetch('/api/collection-points');
    allPoints = await res.json();
    renderPoints(allPoints);
    populatePointsSelect(allPoints);
  } catch (err) {
    console.error('Erro ao carregar pontos:', err);
  }
}

function updateStats() {
  const activeCount = allDemands.filter(d => d.status !== 'CONCLUIDA').length;
  const completedCount = allDemands.filter(d => d.status === 'CONCLUIDA').length;

  statActiveDemands.textContent = activeCount;
  statCompletedDemands.textContent = completedCount;
  statCollectionPoints.textContent = allPoints.length;
}

function renderDemands(demands) {
  if (!demands || demands.length === 0) {
    demandsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 1.1rem;">Nenhuma necessidade encontrada para esta categoria.</p>
      </div>`;
    return;
  }

  demandsGrid.innerHTML = demands.map(demand => {
    const progress = Math.min(100, Math.round((demand.collectedQuantity / demand.targetQuantity) * 100));
    const isCompleted = demand.status === 'CONCLUIDA';

    return `
      <div class="demand-card">
        <div>
          <div class="card-top">
            <span class="card-category">${demand.category}</span>
            ${demand.urgent ? '<span class="badge-urgent">🚨 URGENTE</span>' : ''}
          </div>
          <h4>${escapeHtml(demand.title)}</h4>
          <p>${escapeHtml(demand.description)}</p>

          <div class="demand-meta">
            <div>Beneficiário: <strong>${escapeHtml(demand.beneficiaryEntity)}</strong></div>
            <div>Contato: <strong>${escapeHtml(demand.contactPhone)}</strong></div>
          </div>
        </div>

        <div>
          <div class="progress-container">
            <div class="progress-info">
              <span>Arrecadado: ${demand.collectedQuantity} / ${demand.targetQuantity} ${demand.unit}</span>
              <span>${progress}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${isCompleted ? 'completed' : ''}" style="width: ${progress}%;"></div>
            </div>
          </div>

          <div class="card-footer">
            <span style="font-size: 0.8rem; font-weight: 700; color: ${isCompleted ? '#16a34a' : '#2563eb'}">
              ${isCompleted ? '✅ META ATINGIDA' : '⏳ EM ARRECADAÇÃO'}
            </span>
            ${
              isCompleted
                ? '<button class="btn btn-secondary" disabled style="opacity: 0.7; cursor: not-allowed;">Concluído</button>'
                : `<button class="btn btn-primary" onclick="openDonateModal('${demand.id}')">Quero Doar</button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderPoints(points) {
  pointsGrid.innerHTML = points.map(pt => `
    <div class="point-card">
      <h5>📍 ${escapeHtml(pt.name)}</h5>
      <p><strong>Bairro:</strong> ${escapeHtml(pt.neighborhood)}</p>
      <p><strong>Endereço:</strong> ${escapeHtml(pt.address)}</p>
      <p><strong>Horário:</strong> ${escapeHtml(pt.openingHours)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(pt.contactPhone)}</p>
    </div>
  `).join('');
}

function populatePointsSelect(points) {
  donatePoint.innerHTML = `
    <option value="">Entrega direta com a entidade ou a combinar</option>
    ${points.map(p => `<option value="${p.id}">${escapeHtml(p.name)} (${escapeHtml(p.neighborhood)})</option>`).join('')}
  `;
}

function setupEventListeners() {
  // Filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      loadDemands();
    });
  });

  // Modal Nova Demanda
  btnOpenNewDemand.addEventListener('click', () => modalDemand.classList.add('active'));
  btnCloseDemandModal.addEventListener('click', () => modalDemand.classList.remove('active'));
  btnCancelDemand.addEventListener('click', () => modalDemand.classList.remove('active'));

  // Submit Nova Demanda
  formNewDemand.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('demandTitle').value,
      category: document.getElementById('demandCategory').value,
      urgent: document.getElementById('demandUrgent').value === 'true',
      targetQuantity: Number(document.getElementById('demandTarget').value),
      unit: document.getElementById('demandUnit').value,
      beneficiaryEntity: document.getElementById('demandEntity').value,
      contactPhone: document.getElementById('demandPhone').value,
      description: document.getElementById('demandDesc').value
    };

    try {
      const res = await fetch('/api/demands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Erro: ' + error.error);
        return;
      }

      formNewDemand.reset();
      modalDemand.classList.remove('active');
      await loadData();
      alert('Demanda comunitária cadastrada com sucesso!');
    } catch (err) {
      alert('Falha na comunicação com o servidor.');
    }
  });

  // Modal Doar
  btnCloseDonateModal.addEventListener('click', () => modalDonate.classList.remove('active'));
  btnCancelDonate.addEventListener('click', () => modalDonate.classList.remove('active'));

  // Submit Doação
  formDonate.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      demandId: donateDemandId.value,
      donorName: document.getElementById('donorName').value,
      donorPhone: document.getElementById('donorPhone').value,
      quantity: Number(document.getElementById('donateQuantity').value),
      collectionPointId: donatePoint.value || undefined
    };

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Erro: ' + error.error);
        return;
      }

      formDonate.reset();
      modalDonate.classList.remove('active');
      await loadData();
      alert('Muito obrigado! Sua intenção de doação foi confirmada e somada à demanda.');
    } catch (err) {
      alert('Falha ao processar doação.');
    }
  });
}

window.openDonateModal = function(id) {
  const demand = allDemands.find(d => d.id === id);
  if (!demand) return;

  donateDemandId.value = demand.id;
  donateUnitLabel.textContent = demand.unit;
  const remaining = Math.max(0, demand.targetQuantity - demand.collectedQuantity);

  donateTargetSummary.innerHTML = `
    <strong>Demanda:</strong> ${escapeHtml(demand.title)}<br>
    <strong>Beneficiário:</strong> ${escapeHtml(demand.beneficiaryEntity)}<br>
    <strong>Meta Faltante:</strong> ${remaining} ${demand.unit}
  `;

  document.getElementById('donateQuantity').max = remaining > 0 ? remaining : 9999;
  modalDonate.classList.add('active');
};

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}
