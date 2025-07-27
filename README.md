## 📘 Personal Finance Tracker 💸

A full-stack finance tracking app that helps users add income/expenses, view them, and receive smart alerts like:

> ⚠️ "Rent is more than 50% of your income!"

I built this application after learning React during summer 2025 to practice full-stack development .
---

### 🔧 Tech Stack

- **Frontend**: React + Axios  
- **Backend**: Node.js + Express  
- **Database**: MongoDB Atlas (via Mongoose)  
- **Optional**: Chart.js, Tailwind CSS

---

### ✅ Features

- Add transactions (income/expense)
- View all transactions
- Smart alerts based on spending habits
- Clean and simple UI
- Connects to MongoDB cloud

---

### 🚀 Getting Started

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

---

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URL=mongodb+srv://your-user:your-password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

Run the backend:
```bash
node index.js
```

---

#### 3. Frontend Setup

```bash
cd ../client
npm install
npm start
```

---

### 📡 API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/transactions`   | Add a transaction        |
| GET    | `/api/transactions`   | List all transactions    |
| GET    | `/api/alerts`         | Get smart finance alerts |



---

### 🧠 Smart Alerts Logic (examples)

- Rent > 50% of income → “⚠️ Rent is too high”
- Overspending on Food → “⚠️ Watch your food budget”
- Monthly savings decreasing → “⚠️ Saving trend down”

---

### 📦 Future Improvements

- Add charts with Chart.js
- Monthly summaries
- User authentication
- Dark mode / responsive design

---

### 👨‍💻 Author

**Rithwik Yaramaneni**  


---
