import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/transactions";

function getTotals(transactions) {
  let income = 0, expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else if (t.type === "expense") expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

function formatINR(amount) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  });
}

function TransactionsForm() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Alerts state
  const [alerts, setAlerts] = useState([]);

  // Fetch Transactions
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(result => {
        if (result.success) setTransactions(result.data);
        else alert("Failed to fetch transactions: " + result.message);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch Alerts
  useEffect(() => {
    axios.get('http://localhost:5000/api/alerts')
      .then(res => setAlerts(res.data.alerts || []))
      .catch(() => setAlerts([]));
  }, []);

  // Add new transaction
  const handleSubmit = async e => {
    e.preventDefault();
    const newTransaction = { type, amount: Number(amount), category, description };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction)
    });
    const result = await res.json();
    if (res.ok && result.success) {
      setTransactions(prev => [result.data, ...prev]);
      setType("income");
      setAmount("");
      setCategory("");
      setDescription("");
    } else {
      alert(result.message || "Failed to add transaction");
    }
  };

  const totals = getTotals(transactions);

  return (
    <div style={styles.pageContainer}>
      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={styles.alertBox}>
          {alerts.map((alert, idx) => (
            <div key={idx} style={{ marginBottom: 4 }}>
              {alert}
            </div>
          ))}
        </div>
      )}

      <div style={styles.inner}>
        <h2 style={styles.heading}>Finance Tracker</h2>
        <div style={styles.totalsBox}>
          <div style={{ ...styles.totalItem, color: "#06a77d" }}>
            <span>Income</span>
            <b>{formatINR(totals.income)}</b>
          </div>
          <div style={{ ...styles.totalItem, color: "#e84a5f" }}>
            <span>Expense</span>
            <b>{formatINR(totals.expense)}</b>
          </div>
          <div style={styles.totalItem}>
            <span>Net Total</span>
            <b>{formatINR(totals.net)}</b>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
          <div style={styles.row}>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={styles.input}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="number"
              min="0"
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <input
            type="text"
            style={styles.input}
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
          <input
            type="text"
            style={styles.input}
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>Add Transaction</button>
        </form>

        <h3 style={{ margin: "2em 0 0.5em" }}>All Transactions</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul style={styles.txList}>
            {transactions.map(tx => (
              <li key={tx._id} style={styles.txItem}>
                <span style={{
                  ...styles.txType,
                  background: tx.type === "income" ? "#d9f8c4" : "#ffe0e6",
                  color: tx.type === "income" ? "#06a77d" : "#e84a5f"
                }}>
                  {tx.type}
                </span>
                <span style={{ fontWeight: 700, color: tx.type === "income" ? "#06a77d" : "#e84a5f" }}>
                  {formatINR(tx.amount)}
                </span>
                <span style={styles.txCategory}>{tx.category}</span>
                <span style={styles.txDesc}>
                  {tx.description || "(no description)"}
                </span>
                <span style={styles.txDate}>
                  {tx.date && new Date(tx.date).toLocaleString("en-IN", {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100vw",
    background: "#fafbfc",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    flexDirection: "column"
  },
  alertBox: {
    width: "100%",
    maxWidth: 600,
    background: "#fffbe6",
    border: "1px solid #ffe58f",
    color: "#ad8b00",
    padding: "12px 18px",
    borderRadius: 8,
    margin: "40px auto 8px auto",
    fontWeight: 600,
    fontSize: 16,
    boxSizing: "border-box"
  },
  inner: {
    width: "100%",
    maxWidth: 600,
    margin: "16px auto",
    padding: "2rem 1rem 3rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  },
  heading: {
    margin: "0 0 1.5em",
    textAlign: "center",
    fontWeight: 700,
    letterSpacing: ".1em"
  },
  totalsBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: "2em",
    marginBottom: "2em",
    background: "#f7f7f7",
    borderRadius: 8,
    boxShadow: "0 1px 5pxrgb(11, 11, 18)",
    padding: "1em"
    
  },
  totalItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 16,
    fontWeight: 600,
    flex: 1,
    color:"black"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#fff",
    padding: "1.5em 1em",
    borderRadius: 8,
    boxShadow: "0 1px 6px #f2f2f2"
  },
  row: {
    display: "flex",
    gap: 12
  },
  input: {
    background: "#f4f8fb",
    border: "1px solid #dde3e8",
    borderRadius: 5,
    padding: "8px 12px",
    fontSize: 15,
    width: "100%",
    flex: 1,
    color: "#111" // Matte black text
  },
  button: {
    marginTop: 8,
    background: "linear-gradient(90deg,#06a77d 60%, #45c490 100%)",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "10px 0",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 1px 4px #ceefe7"
  },
  txList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  txItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    borderRadius: 7,
    marginBottom: 12,
    padding: "0.8em 0.7em",
    boxShadow: "0 1px 5px #f3f4f7",
    borderLeft: "5px solid #99e9b8"
  },
  txType: {
    padding: "3px 12px",
    borderRadius: 99,
    textTransform: "capitalize",
    fontWeight: 600,
    fontSize: 15,
    background:"grey",
  },
  txCategory: {
    minWidth: 70,
    borderRadius: 4,
    padding: "2px 8px",
    fontSize: 14,
    fontWeight: 500,
    color: "black",
    textAlign:"center"
  },
  txDesc: {
    flex: 1,
    color: "#555",
    fontSize: 14,
    marginLeft: 5
  },
  txDate: {
    color: "#adadad",
    fontSize: 13,
    marginLeft: 12,
    minWidth: 110,
    textAlign: "right"
  }
};

export default TransactionsForm;
