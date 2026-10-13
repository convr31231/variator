const PRICE_TYPES = new Set(['exact', 'from', 'request']);

export function formatPrice(type, amount) {
  const t = PRICE_TYPES.has(type) ? type : 'request';
  if (t === 'request') return 'по запросу';
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) return 'по запросу';
  const formatted = new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  return t === 'from' ? `от ${formatted}` : formatted;
}

export function parsePriceLabel(label) {
  const raw = String(label || '').trim().toLowerCase();
  if (!raw || raw.includes('запрос')) {
    return { priceType: 'request', priceAmount: null, price: 'по запросу' };
  }
  const digits = raw.replace(/[^\d]/g, '');
  const amount = digits ? Number(digits) : null;
  if (!amount) {
    return { priceType: 'request', priceAmount: null, price: 'по запросу' };
  }
  // \b ненадёжен для кириллицы — проверяем «от» + пробел/конец
  const type = /^от(?:\s|$)/i.test(raw) ? 'from' : 'exact';
  return { priceType: type, priceAmount: amount, price: formatPrice(type, amount) };
}

export function normalizePriceFields(item) {
  let type = item.priceType;
  let amount = item.priceAmount;
  if (!PRICE_TYPES.has(type)) {
    const parsed = parsePriceLabel(item.price);
    type = parsed.priceType;
    amount = parsed.priceAmount;
  }
  if (type === 'request') amount = null;
  else {
    amount = Number(amount);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('Укажите корректную сумму цены');
    }
  }
  return {
    priceType: type,
    priceAmount: amount,
    price: formatPrice(type, amount),
  };
}
