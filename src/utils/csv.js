const CSV_HEADERS = ["title", "amount", "date"];

function escapeCell(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toDateInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function expensesToCsv(expenses) {
  const rows = expenses.map((expense) =>
    [
      escapeCell(expense.title),
      escapeCell(expense.amount),
      escapeCell(toDateInput(expense.date)),
    ].join(",")
  );
  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

export function downloadCsv(expenses, filename = "expenses.csv") {
  const csv = expensesToCsv(expenses);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

export function csvToExpenses(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];

  const headers = parseLine(lines[0]).map((h) => h.trim().toLowerCase());
  const titleIdx = headers.indexOf("title");
  const amountIdx = headers.indexOf("amount");
  const dateIdx = headers.indexOf("date");

  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const rawAmount = Number(cells[amountIdx]);
    const rawDate = dateIdx >= 0 ? cells[dateIdx] : "";
    const parsedDate = rawDate ? new Date(rawDate) : new Date();

    return {
      id: Math.random().toString(36).slice(2),
      title: (titleIdx >= 0 ? cells[titleIdx] : "").trim() || "Untitled",
      amount: Number.isNaN(rawAmount) ? 0 : rawAmount,
      date: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    };
  });
}
