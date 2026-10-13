export const EXPENSE_CATEGORIES = [
  { id: "Food", label: "Food", icon: "🍔", color: "#f97316" },
  { id: "Transport", label: "Transport", icon: "🚗", color: "#3b82f6" },
  { id: "Shopping", label: "Shopping", icon: "🛍️", color: "#ec4899" },
  { id: "Bills", label: "Bills", icon: "🧾", color: "#eab308" },
  { id: "Entertainment", label: "Entertainment", icon: "🎬", color: "#a855f7" },
  { id: "Health", label: "Health", icon: "💊", color: "#10b981" },
  { id: "Other", label: "Other", icon: "📦", color: "#64748b" },
];

export const INCOME_CATEGORIES = [
  { id: "Salary", label: "Salary", icon: "💼", color: "#22c55e" },
  { id: "Freelance", label: "Freelance", icon: "💻", color: "#14b8a6" },
  { id: "Investment", label: "Investment", icon: "📈", color: "#06b6d4" },
  { id: "Gift", label: "Gift", icon: "🎁", color: "#f43f5e" },
  { id: "Other", label: "Other", icon: "📦", color: "#64748b" },
];

const ALL = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES.filter(
    (c) => !EXPENSE_CATEGORIES.some((e) => e.id === c.id)
  ),
];

const FALLBACK = { id: "Other", label: "Other", icon: "📦", color: "#64748b" };

export const getCategories = (type) =>
  type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

export const getCategoryMeta = (category) =>
  ALL.find((c) => c.id === category) || FALLBACK;

export const TYPES = [
  { id: "expense", label: "Expense", icon: "−" },
  { id: "income", label: "Income", icon: "+" },
];
