import { getCategories } from "../constants";

export const RECURRING_KEY = "expense-tracker:recurring";

export const createRecurringRule = (input) => ({
  id: Math.random().toString(36).slice(2),
  title: input.title,
  amount: Number(input.amount) || 0,
  type: input.type === "income" ? "income" : "expense",
  category: input.category || getCategories(input.type)[0].id,
  day: Math.min(Math.max(Number(input.day) || 1, 1), 28),
  enabled: true,
  lastRun: null,
});

const periodKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

export function runRecurring(rules, now = new Date()) {
  const occurrences = [];
  const key = periodKey(now);
  const today = now.getDate();

  const updated = rules.map((rule) => {
    if (!rule.enabled) return rule;
    if (rule.lastRun === key) return rule;
    if (today < rule.day) return rule;

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const day = Math.min(rule.day, daysInMonth);

    occurrences.push({
      id: Math.random().toString(36).slice(2),
      title: rule.title,
      amount: rule.amount,
      type: rule.type,
      category: rule.category,
      date: new Date(now.getFullYear(), now.getMonth(), day),
      recurringId: rule.id,
    });

    return { ...rule, lastRun: key };
  });

  return { occurrences, updated };
}

export const describeSchedule = (day) => {
  const suffix = (d) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `Monthly on the ${day}${suffix(day)}`;
};
