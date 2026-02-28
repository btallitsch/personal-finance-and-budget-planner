export const genId = () => Math.random().toString(36).slice(2, 9);

export const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const daysLeft = (deadline) => {
  if (!deadline) return null;
  const diff = (new Date(deadline) - new Date()) / 86400000;
  return Math.ceil(diff);
};

/** Seed 3 months of realistic demo transactions */
export const seedDemo = (categories) => {
  const txs = [];
  const now = new Date();

  for (let m = 0; m < 3; m++) {
    const d   = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const mo  = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    txs.push({ id: genId(), date: `${mo}-01`, desc: "Monthly Salary", amount: 5500, type: "income", categoryId: categories[0].id, notes: "" });

    const items = [
      { desc: "Rent",         amount: 1400, catIdx: 0 },
      { desc: "Groceries",    amount: 120,  catIdx: 1 },
      { desc: "Whole Foods",  amount: 85,   catIdx: 1 },
      { desc: "Gas",          amount: 60,   catIdx: 2 },
      { desc: "Uber",         amount: 35,   catIdx: 2 },
      { desc: "Netflix",      amount: 16,   catIdx: 5 },
      { desc: "Gym",          amount: 40,   catIdx: 5 },
      { desc: "Amazon",       amount: 95,   catIdx: 4 },
      { desc: "Electric bill",amount: 90,   catIdx: 6 },
      { desc: "Internet",     amount: 55,   catIdx: 6 },
      { desc: "Doctor visit", amount: 30,   catIdx: 3 },
    ];

    items.forEach((item, i) => {
      txs.push({
        id: genId(),
        date: `${mo}-${String(i + 2).padStart(2, "0")}`,
        desc: item.desc,
        amount: item.amount,
        type: "expense",
        categoryId: categories[item.catIdx].id,
        notes: "",
      });
    });
  }

  return txs;
};
