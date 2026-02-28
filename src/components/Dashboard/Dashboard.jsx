import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import StatCard      from "../UI/StatCard";
import ChartTooltip  from "../UI/ChartTooltip";
import ProgressBar   from "../UI/ProgressBar";
import { fmtMoney, getCurrentMonth } from "../../utils/helpers";
import { MONTHS } from "../../data/defaults";

/* ─── Recent Transactions List ─────────────────────────────── */
function RecentTransactions({ transactions, categories }) {
  const getCat = (id) => categories.find((c) => c.id === id);
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="card fade-in">
      <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 16 }}>Recent Transactions</h3>

      {recent.length === 0 ? (
        <div style={{ color: "var(--muted)", fontSize: 14, padding: "20px 0" }}>
          No transactions yet. Add your first one!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recent.map((t) => {
            const cat = getCat(t.categoryId);
            return (
              <div
                key={t.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: "1px solid rgba(42,42,37,0.4)",
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "var(--surface)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}
                >
                  {cat?.icon || "📦"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.desc}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {t.date} · {cat?.name}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--serif)", fontWeight: 600, flexShrink: 0,
                    color: t.type === "income" ? "var(--green)" : "var(--red)",
                  }}
                >
                  {t.type === "income" ? "+" : "-"}{fmtMoney(t.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Goals Summary ─────────────────────────────────────────── */
function GoalsSummary({ goals }) {
  const withPct = goals.map((g) => ({
    ...g,
    pct: Math.min(100, Math.round((g.saved / g.target) * 100)),
  }));

  return (
    <div className="card fade-in">
      <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 16 }}>Savings Goals</h3>

      {withPct.length === 0 ? (
        <div style={{ color: "var(--muted)", fontSize: 14, padding: "20px 0" }}>
          No goals set yet. Create your first savings goal!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {withPct.map((g) => (
            <div key={g.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                <span style={{ fontWeight: 500 }}>{g.icon} {g.name}</span>
                <span style={{ color: "var(--muted)" }}>{fmtMoney(g.saved)} / {fmtMoney(g.target)}</span>
              </div>
              <div className="savings-bar-wrap">
                <div
                  className="savings-bar"
                  style={{ width: `${g.pct}%`, background: g.pct >= 100 ? "var(--green)" : "var(--amber)" }}
                >
                  {g.pct > 20 && `${g.pct}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Spending Pie ───────────────────────────────────────────── */
function SpendingPie({ catSpend }) {
  return (
    <div className="card fade-in">
      <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 20 }}>Spending by Category</h3>

      {catSpend.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "var(--muted)", fontSize: 14 }}>
          No expenses this month
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie data={catSpend} dataKey="spent" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {catSpend.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtMoney(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {catSpend.slice(0, 6).map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <span style={{ flex: 1, color: "var(--muted)" }}>{c.name}</span>
                <span style={{ fontWeight: 600 }}>{fmtMoney(c.spent)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Trend Chart ────────────────────────────────────────────── */
function TrendChart({ trendData }) {
  return (
    <div className="card fade-in">
      <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 20 }}>6-Month Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4caf7d" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4caf7d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#e05c5c" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#e05c5c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a25" />
          <XAxis dataKey="month" tick={{ fill: "#7a7870", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7a7870", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="Income"   stroke="#4caf7d" strokeWidth={2} fill="url(#gIncome)"   />
          <Area type="monotone" dataKey="Expenses" stroke="#e05c5c" strokeWidth={2} fill="url(#gExpenses)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Dashboard (main export) ───────────────────────────────── */
export default function Dashboard({ transactions, categories, goals }) {
  const now          = new Date();
  const currentMonth = getCurrentMonth();
  const monthTxs     = transactions.filter((t) => t.date.startsWith(currentMonth));

  const totalIncome   = monthTxs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const totalExpenses = monthTxs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const netSavings    = totalIncome - totalExpenses;

  // Category spend for pie
  const catSpend = categories
    .map((c) => ({
      name: c.name, color: c.color,
      spent: monthTxs.filter((t) => t.type === "expense" && t.categoryId === c.id).reduce((a, t) => a + t.amount, 0),
    }))
    .filter((c) => c.spent > 0);

  // 6-month trend data
  const trendData = Array.from({ length: 6 }).map((_, i) => {
    const d   = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const txs = transactions.filter((t) => t.date.startsWith(key));
    return {
      month:    MONTHS[d.getMonth()],
      Income:   txs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0),
      Expenses: txs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0),
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI strip */}
      <div className="grid-4">
        <StatCard
          label="Monthly Income"
          value={fmtMoney(totalIncome)}
          icon="💰"
          color="var(--green)"
          sub={`${MONTHS[now.getMonth()]} ${now.getFullYear()}`}
        />
        <StatCard
          label="Monthly Expenses"
          value={fmtMoney(totalExpenses)}
          icon="📤"
          color="var(--red)"
          sub={`${monthTxs.filter((t) => t.type === "expense").length} transactions`}
        />
        <StatCard
          label="Net Savings"
          value={fmtMoney(netSavings)}
          icon="🏦"
          color={netSavings >= 0 ? "var(--green)" : "var(--red)"}
          sub={netSavings >= 0 ? "Great job!" : "Over budget"}
        />
        <StatCard
          label="Savings Goals"
          value={goals.length}
          icon="🎯"
          color="var(--amber)"
          sub={`${goals.filter((g) => g.saved >= g.target).length} completed`}
        />
      </div>

      {/* Charts */}
      <div className="grid-2">
        <TrendChart trendData={trendData} />
        <SpendingPie catSpend={catSpend} />
      </div>

      {/* Bottom */}
      <div className="grid-2">
        <RecentTransactions transactions={transactions} categories={categories} />
        <GoalsSummary goals={goals} />
      </div>
    </div>
  );
}
