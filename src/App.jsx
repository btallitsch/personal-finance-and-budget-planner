import { useState, useEffect } from "react";

// Styles
import "./styles/globals.css";

// Hooks & utils
import { useStorage }                from "./hooks/useStorage";
import { genId, seedDemo }           from "./utils/helpers";
import { DEFAULT_CATEGORIES }        from "./data/defaults";

// Layout
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

// Pages
import Dashboard   from "./components/Dashboard/Dashboard";
import Transactions from "./components/Transactions/Transactions";
import Budget       from "./components/Budget/Budget";
import Goals        from "./components/Goals/Goals";

export default function App() {
  const [transactions, setTransactions] = useStorage("fp_transactions", null);
  const [categories,   setCategories]   = useStorage("fp_categories",   DEFAULT_CATEGORIES);
  const [goals,        setGoals]        = useStorage("fp_goals",        []);
  const [seeded,       setSeeded]       = useStorage("fp_seeded",       false);
  const [activeTab,    setActiveTab]    = useState("dashboard");

  // Seed demo data on first load
  useEffect(() => {
    if (!seeded && !transactions) {
      setTransactions(seedDemo(DEFAULT_CATEGORIES));
      setGoals([
        { id: genId(), name: "Emergency Fund", target: 10000, saved: 3200, icon: "🏦", deadline: "2026-12-31" },
        { id: genId(), name: "Europe Trip",    target: 4000,  saved: 1500, icon: "✈️", deadline: "2026-08-01" },
        { id: genId(), name: "New MacBook",    target: 2500,  saved: 2500, icon: "💻", deadline: "" },
      ]);
      setSeeded(true);
    } else if (!transactions) {
      setTransactions([]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!transactions) return null;

  const pages = {
    dashboard:    <Dashboard    transactions={transactions} categories={categories} goals={goals} />,
    transactions: <Transactions transactions={transactions} setTransactions={setTransactions} categories={categories} />,
    budget:       <Budget       transactions={transactions} categories={categories} setCategories={setCategories} />,
    goals:        <Goals        goals={goals} setGoals={setGoals} />,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
        {pages[activeTab]}
      </main>

      <Footer />
    </div>
  );
}
