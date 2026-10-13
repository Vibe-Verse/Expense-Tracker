const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => currencyFormatter.format(value || 0);

export const formatCurrencyCompact = (value) =>
  compactCurrencyFormatter.format(value || 0);

export const formatDate = (value, options) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(
    "en-US",
    options || { month: "short", day: "numeric", year: "numeric" }
  );
};

export const toDateInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
};

export const monthKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${date.getMonth()}`;
};

export const monthLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

export const isSameMonth = (value, reference = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
};

export const shiftMonth = (monthsAgo, from = new Date()) =>
  new Date(from.getFullYear(), from.getMonth() - monthsAgo, 1);
