// Shared Budget Management & Public Transparency Store for Brgy360
// Serves as the single source of truth synchronizing Admin Budget Management (admin.html)
// and the Public Home Page Budget & Spending Transparency Dashboard (index.html)

export const BUDGET_STORAGE_KEY = 'brgy360_budget_records';
const BUDGET_SYNC_VERSION_KEY = 'brgy360_budget_sync_v2';
const BUDGET_CHANNEL_NAME = 'brgy360_budget_sync';
const BUDGET_DOM_EVENT = 'brgy360_budget_changed';

export const BUDGET_CATEGORIES = [
  'Infrastructure',
  'Health',
  'Social Services',
  'Administration',
  'Emergency Preparedness',
  'Education, Sports & Recreation',
  'Agriculture & Livelihood',
  'Environment & Waste Management'
];

export const CORE_PUBLIC_CATEGORIES = [
  'Infrastructure',
  'Health',
  'Administration',
  'Social Services'
];

export const BUDGET_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export const BUDGET_CATEGORY_COLORS = {
  Infrastructure: '#0d47a1',
  Health: '#16a34a',
  Administration: '#f59e0b',
  'Social Services': '#7c3aed',
  'Emergency Preparedness': '#dc2626',
  'Education, Sports & Recreation': '#0284c7',
  'Agriculture & Livelihood': '#65a30d',
  'Environment & Waste Management': '#0d9488'
};

export const BUDGET_RECORD_STATUSES = [
  'Active',
  'Ongoing',
  'Completed',
  'Planned',
  'Inactive'
];

export const DEFAULT_BUDGET_RECORDS = [
  // 2026 Fiscal Year
  {
    id: 'BGT-2026-001',
    year: '2026',
    quarter: 'Q1',
    category: 'Infrastructure',
    description: 'Drainage Desiltation & Street Repair Sitio Ibaba',
    remarks: 'Completed Q1 flood canal clearing and concrete patching',
    budget: 320000,
    actual: 310000,
    status: 'Completed'
  },
  {
    id: 'BGT-2026-002',
    year: '2026',
    quarter: 'Q1',
    category: 'Health',
    description: 'Q1 Medical Mission & Senior Vaccine Procurement',
    remarks: 'Disbursed with City Health Office cold-chain delivery',
    budget: 150000,
    actual: 145000,
    status: 'Completed'
  },
  {
    id: 'BGT-2026-003',
    year: '2026',
    quarter: 'Q1',
    category: 'Administration',
    description: 'Barangay Hall Office Supplies & IT Equipment',
    remarks: 'Registry workstations and civil issuance supplies',
    budget: 120000,
    actual: 115000,
    status: 'Completed'
  },
  {
    id: 'BGT-2026-004',
    year: '2026',
    quarter: 'Q1',
    category: 'Social Services',
    description: 'First Quarter Youth Leadership & Sports Camp',
    remarks: 'Sangguniang Kabataan & BSWD community youth program',
    budget: 95000,
    actual: 90000,
    status: 'Completed'
  },
  {
    id: 'BGT-2026-005',
    year: '2026',
    quarter: 'Q2',
    category: 'Infrastructure',
    description: 'Smart Solar Streetlights Installation Phase 1',
    remarks: 'Solar LED posts installed across priority sitios',
    budget: 380000,
    actual: 325000,
    status: 'Active'
  },
  {
    id: 'BGT-2026-006',
    year: '2026',
    quarter: 'Q2',
    category: 'Health',
    description: 'Child Nutrition & Deworming Outreach Program',
    remarks: 'Barangay Health Worker pediatric nutrition rollout',
    budget: 110000,
    actual: 95000,
    status: 'Completed'
  },
  {
    id: 'BGT-2026-007',
    year: '2026',
    quarter: 'Q2',
    category: 'Administration',
    description: 'Staff Capacity Training & Semi-Annual Audit',
    remarks: 'DILG Full Disclosure compliance & treasury audit',
    budget: 80000,
    actual: 72000,
    status: 'Completed'
  },
  {
    id: 'BGT-2026-008',
    year: '2026',
    quarter: 'Q2',
    category: 'Social Services',
    description: 'Community Day Care Center Educational Materials',
    remarks: 'Early childhood learning kits and classroom supplies',
    budget: 70000,
    actual: 56000,
    status: 'Active'
  },
  {
    id: 'BGT-2026-009',
    year: '2026',
    quarter: 'Q3',
    category: 'Infrastructure',
    description: 'Flood Retaining Wall Reinforcement Tierra Verde',
    remarks: 'Ongoing civil engineering works along creek embankment',
    budget: 300000,
    actual: 150000,
    status: 'Ongoing'
  },
  {
    id: 'BGT-2026-010',
    year: '2026',
    quarter: 'Q3',
    category: 'Health',
    description: 'Dengue Prevention & Clean Water Testing Kits',
    remarks: 'Larvicide distribution and potable water sampling',
    budget: 90000,
    actual: 60000,
    status: 'Ongoing'
  },
  {
    id: 'BGT-2026-011',
    year: '2026',
    quarter: 'Q4',
    category: 'Infrastructure',
    description: 'CCTVs & Operations Center Equipment Setup',
    remarks: 'Scheduled Q4 procurement under AIP',
    budget: 260000,
    actual: 0,
    status: 'Planned'
  },
  {
    id: 'BGT-2026-012',
    year: '2026',
    quarter: 'Q4',
    category: 'Health',
    description: 'Year-End First Aid & Disaster Emergency Resupply',
    remarks: 'Scheduled Q4 medical & BDRRMC emergency stock',
    budget: 70000,
    actual: 0,
    status: 'Planned'
  },
  {
    id: 'BGT-2026-013',
    year: '2026',
    quarter: 'Q4',
    category: 'Administration',
    description: 'Fiscal Year-End Reporting & Accounting System',
    remarks: 'Scheduled Q4 annual closing & digital ledger maintenance',
    budget: 60000,
    actual: 0,
    status: 'Planned'
  },
  {
    id: 'BGT-2026-014',
    year: '2026',
    quarter: 'Q4',
    category: 'Social Services',
    description: 'PWD & Senior Citizens Year-End Support Package',
    remarks: 'Scheduled Q4 social welfare distribution',
    budget: 80000,
    actual: 0,
    status: 'Planned'
  },
  {
    id: 'BGT-2026-015',
    year: '2026',
    quarter: 'Q2',
    category: 'Emergency Preparedness',
    description: 'BDRRMC Calamity Reserve & Flood Rescue Equipment',
    remarks: 'Emergency response gear, handheld radios, and relief stockpile',
    budget: 180000,
    actual: 112000,
    status: 'Active'
  },
  {
    id: 'BGT-2026-016',
    year: '2026',
    quarter: 'Q2',
    category: 'Education, Sports & Recreation',
    description: 'Day Care Learning Kits & Inter-Sitio Youth Sports League',
    remarks: 'Early childhood educational supplies, court equipment, and scholarships',
    budget: 165000,
    actual: 118000,
    status: 'Active'
  },
  {
    id: 'BGT-2026-017',
    year: '2026',
    quarter: 'Q3',
    category: 'Agriculture & Livelihood',
    description: 'Urban Gardening Seedlings & Barangay Livelihood Training',
    remarks: 'Community vegetable garden inputs and micro-enterprise starter kits',
    budget: 140000,
    actual: 88000,
    status: 'Ongoing'
  },
  {
    id: 'BGT-2026-018',
    year: '2026',
    quarter: 'Q3',
    category: 'Environment & Waste Management',
    description: 'MRF Solid Waste Segregation & Creek Clean-Up Operations',
    remarks: 'Materials Recovery Facility bins, eco-aide tools, and tree planting',
    budget: 160000,
    actual: 105000,
    status: 'Active'
  },

  // 2025 Fiscal Year
  {
    id: 'BGT-2025-001',
    year: '2025',
    quarter: 'Q1',
    category: 'Infrastructure',
    description: 'Barangay Hall E-Library & Tech Hub Refurbishment',
    remarks: 'Completed and turned over to residents',
    budget: 420000,
    actual: 420000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-002',
    year: '2025',
    quarter: 'Q1',
    category: 'Health',
    description: 'Health Station Modernization & Diagnostic Kits',
    remarks: 'Completed maternal & primary care equipment upgrade',
    budget: 290000,
    actual: 290000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-003',
    year: '2025',
    quarter: 'Q2',
    category: 'Infrastructure',
    description: 'Sitio Gitna Central Covered Court Concrete Paving',
    remarks: 'Completed multi-purpose court flooring',
    budget: 350000,
    actual: 345000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-004',
    year: '2025',
    quarter: 'Q2',
    category: 'Administration',
    description: 'Barangay Records Digitization & Computer Terminals',
    remarks: 'Completed civil registry encoding',
    budget: 140000,
    actual: 138000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-005',
    year: '2025',
    quarter: 'Q3',
    category: 'Health',
    description: 'Anti-Dengue Fogging & Clean Water Safety Project',
    remarks: 'Completed monsoon vector control campaign',
    budget: 180000,
    actual: 175000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-006',
    year: '2025',
    quarter: 'Q3',
    category: 'Social Services',
    description: 'Annual Youth Summer Sports Camp & Tournaments',
    remarks: 'Completed inter-sitio youth program',
    budget: 120000,
    actual: 118000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-007',
    year: '2025',
    quarter: 'Q4',
    category: 'Infrastructure',
    description: 'Sitio Santolan Slope Stabilization & Pathway',
    remarks: 'Completed slope protection concrete works',
    budget: 310000,
    actual: 300000,
    status: 'Completed'
  },
  {
    id: 'BGT-2025-008',
    year: '2025',
    quarter: 'Q4',
    category: 'Social Services',
    description: 'Senior Citizens & PWD Year-End Livelihood Aid',
    remarks: 'Completed Q4 social welfare disbursement',
    budget: 170000,
    actual: 164000,
    status: 'Completed'
  }
];

export function escapeBudgetHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatCurrencyPHP(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num) || num === 0) return '₱0';
  const rounded = Math.round(num * 100) / 100;
  const hasDecimals = Math.abs(rounded % 1) > 0.001;
  const absFormatted = Math.abs(rounded).toLocaleString('en-PH', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  });
  return (rounded < 0 ? '-₱' : '₱') + absFormatted;
}

export function formatPercentValue(rate) {
  const num = Number(rate);
  if (!Number.isFinite(num) || num === 0) return '0%';
  const rounded = Math.round(num * 10) / 10;
  return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)) + '%';
}

export function isApplicableBudgetRecord(record) {
  if (!record || typeof record !== 'object') return false;
  const status = String(record.status || 'Active').trim().toLowerCase();
  return status !== 'inactive' && status !== 'archived';
}

export function computeBudgetMetrics(records) {
  const list = Array.isArray(records) ? records : [];
  const totalBudget = list.reduce((sum, item) => {
    const val = Number(item?.budget);
    return sum + (Number.isFinite(val) && val >= 0 ? val : 0);
  }, 0);

  const totalSpending = list.reduce((sum, item) => {
    const val = Number(item?.actual);
    return sum + (Number.isFinite(val) && val >= 0 ? val : 0);
  }, 0);

  // Remaining Budget = Total Annual Budget − Total Spending
  const remainingBudget = totalBudget - totalSpending;

  // Utilization Rate = (Total Spending ÷ Total Annual Budget) × 100 (safe zero-budget handling)
  const rawUtilization = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;
  const utilizationRate = Math.round(rawUtilization * 10) / 10;

  const spentBarPct =
    totalBudget > 0
      ? Math.min(100, Math.max(0, Math.round(rawUtilization * 10) / 10))
      : 0;
  const remainingBarPct =
    totalBudget > 0
      ? Math.max(0, Math.round((100 - spentBarPct) * 10) / 10)
      : 0;

  return {
    totalBudget: Math.round(totalBudget * 100) / 100,
    totalSpending: Math.round(totalSpending * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    rawUtilization,
    utilizationRate,
    utilizationText: formatPercentValue(utilizationRate),
    spentBarPct,
    remainingBarPct
  };
}

function normalizeQuarter(quarter) {
  const q = String(quarter || 'Q1').trim().toUpperCase();
  return BUDGET_QUARTERS.includes(q) ? q : 'Q1';
}

function normalizeCategory(category) {
  const raw = String(category || 'Administration').trim();
  const match = BUDGET_CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
  return match || raw || 'Administration';
}

function normalizeStatus(status, actual = 0) {
  if (!status) {
    return Number(actual) > 0 ? 'Active' : 'Planned';
  }
  const s = String(status).trim().toLowerCase();
  if (s === 'completed') return 'Completed';
  if (s === 'ongoing') return 'Ongoing';
  if (s === 'planned') return 'Planned';
  if (s === 'inactive' || s === 'archived') return 'Inactive';
  return 'Active';
}

export function normalizeBudgetRecord(raw, index = 0) {
  const obj = raw && typeof raw === 'object' ? raw : {};
  const year = String(obj.year || '2026').trim() || '2026';
  const quarter = normalizeQuarter(obj.quarter);
  const category = normalizeCategory(obj.category);

  const rawBudget = Number(obj.budget);
  const budget = Number.isFinite(rawBudget) && rawBudget >= 0 ? Math.round(rawBudget * 100) / 100 : 0;

  const rawActual = Number(obj.actual);
  const actual = Number.isFinite(rawActual) && rawActual >= 0 ? Math.round(rawActual * 100) / 100 : 0;

  const description = String(obj.description || `${quarter} ${category} Budget Allocation`)
    .trim()
    .replace(/Purok\s*1-3/gi, 'Sitio Ibaba')
    .replace(/Purok\s*2/gi, 'Tierra Verde')
    .replace(/Purok\s*4/gi, 'Sitio Gitna')
    .replace(/Sitio\s+Riverside/gi, 'Sitio Santolan');

  const remarks = typeof obj.remarks === 'string' ? obj.remarks.trim() : '';
  const status = normalizeStatus(obj.status, actual);
  const id =
    obj.id !== undefined && obj.id !== null && String(obj.id).trim() !== ''
      ? String(obj.id).trim()
      : `BGT-${year}-${String(index + 1).padStart(3, '0')}`;

  return {
    id,
    year,
    quarter,
    category,
    description,
    remarks,
    budget,
    actual,
    status,
    updatedAt: typeof obj.updatedAt === 'number' ? obj.updatedAt : Date.now()
  };
}

let budgetBroadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    budgetBroadcastChannel = new BroadcastChannel(BUDGET_CHANNEL_NAME);
  }
} catch (_e) {
  budgetBroadcastChannel = null;
}

export function loadBudgetRecords() {
  const defaults = DEFAULT_BUDGET_RECORDS.map((r, i) => normalizeBudgetRecord(r, i));
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(defaults));
      localStorage.setItem(BUDGET_SYNC_VERSION_KEY, 'true');
      return defaults;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(defaults));
      localStorage.setItem(BUDGET_SYNC_VERSION_KEY, 'true');
      return defaults;
    }

    const normalized = parsed.map((r, i) => normalizeBudgetRecord(r, i));
    if (!localStorage.getItem(BUDGET_SYNC_VERSION_KEY)) {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(normalized));
      localStorage.setItem(BUDGET_SYNC_VERSION_KEY, 'true');
    }
    return normalized;
  } catch (err) {
    console.warn('Error loading budget records:', err);
    return defaults;
  }
}

export function saveBudgetRecords(records) {
  const normalized = Array.isArray(records)
    ? records.map((r, i) => normalizeBudgetRecord(r, i))
    : [];

  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(normalized));
    localStorage.setItem(BUDGET_SYNC_VERSION_KEY, 'true');
  } catch (err) {
    console.warn('Error saving budget records to localStorage:', err);
  }

  try {
    if (budgetBroadcastChannel) {
      budgetBroadcastChannel.postMessage({
        type: 'BUDGET_UPDATED',
        timestamp: Date.now()
      });
    }
  } catch (_e) {
    // Ignore BroadcastChannel errors
  }

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(BUDGET_DOM_EVENT, {
          detail: { records: normalized }
        })
      );
    }
  } catch (_e) {
    // Ignore CustomEvent errors
  }

  return normalized;
}

export function getPublicApplicableBudgetRecords(allRecords) {
  const source = Array.isArray(allRecords) ? allRecords : loadBudgetRecords();
  return source.filter(isApplicableBudgetRecord);
}

export function getAvailableFiscalYears(records) {
  const source = Array.isArray(records) ? records : loadBudgetRecords();
  const yearSet = new Set(['2026', '2025']);
  source.forEach((r) => {
    if (r && r.year && /^\d{4}$/.test(String(r.year).trim())) {
      yearSet.add(String(r.year).trim());
    }
  });
  return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
}

export function getActiveCategoriesForYear(records, year = 'all') {
  const source = Array.isArray(records) ? records : [];
  const filtered = source.filter(
    (r) => isApplicableBudgetRecord(r) && (year === 'all' || String(r.year) === String(year))
  );
  const cats = BUDGET_CATEGORIES.filter((cat) =>
    filtered.some(
      (r) => r.category === cat && ((Number(r.budget) || 0) > 0 || (Number(r.actual) || 0) > 0)
    )
  );
  filtered.forEach((r) => {
    if (
      r.category &&
      !cats.includes(r.category) &&
      ((Number(r.budget) || 0) > 0 || (Number(r.actual) || 0) > 0)
    ) {
      cats.push(r.category);
    }
  });
  return cats.length > 0 ? cats : [...CORE_PUBLIC_CATEGORIES];
}

export function generateNextBudgetId(existingRecords, year = '2026') {
  const list = Array.isArray(existingRecords) ? existingRecords : loadBudgetRecords();
  const yr = String(year || '2026').trim();
  const prefix = `BGT-${yr}-`;
  let maxSeq = 0;
  list.forEach((item) => {
    const idStr = String(item?.id || '');
    if (idStr.startsWith(prefix)) {
      const seq = parseInt(idStr.slice(prefix.length), 10);
      if (Number.isFinite(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

/**
 * Proportionally distributes a target peso amount (`budget` or `actual`) across a non-empty array of records
 * so that the sum of `record[field]` equals `targetAmount` with exact peso accuracy.
 */
export function distributeTargetAmountAcrossRecords(records, field, targetAmount) {
  if (!Array.isArray(records) || records.length === 0) return [];
  const safeTarget = Math.max(0, Math.round(Number(targetAmount) || 0));

  if (safeTarget === 0) {
    records.forEach((r) => {
      r[field] = 0;
    });
    return records;
  }

  const currentWeights = records.map((r) => Math.max(0, Number(r[field]) || 0));
  let weightSum = currentWeights.reduce((a, b) => a + b, 0);

  // Fallback weights if all current values in `field` are 0 (e.g., distributing spending onto unspent records)
  let effectiveWeights = currentWeights;
  if (weightSum <= 0) {
    const altField = field === 'actual' ? 'budget' : 'actual';
    const altWeights = records.map((r) => Math.max(0, Number(r[altField]) || 0));
    const altSum = altWeights.reduce((a, b) => a + b, 0);
    if (altSum > 0) {
      effectiveWeights = altWeights;
      weightSum = altSum;
    } else {
      effectiveWeights = records.map(() => 1);
      weightSum = records.length;
    }
  }

  let runningSum = 0;
  let largestIdx = 0;
  let largestWeight = -1;

  const newValues = effectiveWeights.map((w, idx) => {
    if (w > largestWeight) {
      largestWeight = w;
      largestIdx = idx;
    }
    const share = Math.round((w / weightSum) * safeTarget);
    runningSum += share;
    return share;
  });

  const diff = safeTarget - runningSum;
  if (diff !== 0) {
    newValues[largestIdx] = Math.max(0, newValues[largestIdx] + diff);
  }

  records.forEach((r, idx) => {
    r[field] = newValues[idx];
  });

  return records;
}

export function subscribeBudgetRecords(onChange) {
  if (typeof window === 'undefined' || typeof onChange !== 'function') {
    return () => {};
  }

  const trigger = () => {
    onChange(loadBudgetRecords());
  };

  const handleStorage = (event) => {
    if (!event.key || event.key === BUDGET_STORAGE_KEY) {
      trigger();
    }
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      trigger();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(BUDGET_DOM_EVENT, trigger);
  window.addEventListener('pageshow', trigger);
  window.addEventListener('focus', trigger);
  document.addEventListener('visibilitychange', handleVisibility);

  let channelHandler = null;
  if (budgetBroadcastChannel) {
    channelHandler = (event) => {
      if (event?.data?.type === 'BUDGET_UPDATED') {
        trigger();
      }
    };
    budgetBroadcastChannel.addEventListener('message', channelHandler);
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(BUDGET_DOM_EVENT, trigger);
    window.removeEventListener('pageshow', trigger);
    window.removeEventListener('focus', trigger);
    document.removeEventListener('visibilitychange', handleVisibility);
    if (budgetBroadcastChannel && channelHandler) {
      budgetBroadcastChannel.removeEventListener('message', channelHandler);
    }
  };
}
