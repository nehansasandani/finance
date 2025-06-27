import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import baseURL from "../../utils/baseURL";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinanceDashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userAuth = useSelector((state) => state.user.userAuth);

  useEffect(() => {
    if (userAuth?.token) {
      fetchFinancialData(userAuth.token);
    }
  }, [userAuth]);

  // Fetch Total Income
  const fetchTotalIncome = async (token) => {
    try {
      const response = await fetch(`${baseURL}/income/total`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch total income");
      }

      const data = await response.json();
      return data.totalIncome || 0;
    } catch (err) {
      console.error("Error fetching total income:", err);
      return 0;
    }
  };

  // Fetch Total Expenses
  const fetchTotalExpense = async (token) => {
    try {
      const response = await fetch(`${baseURL}/expenses/total`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch total expenses");
      }

      const data = await response.json();
      return data.totalExpenses || 0;
    } catch (err) {
      console.error("Error fetching total expenses:", err);
      return 0;
    }
  };

  // Fetch Financial Data
  const fetchFinancialData = async (token) => {
    try {
      const totalIncome = await fetchTotalIncome(token);
      const totalExpenses = await fetchTotalExpense(token);

      setRevenue(totalIncome);
      setExpenses(totalExpenses);
      setProfitLoss(totalIncome - totalExpenses);
      setBalance(totalIncome - totalExpenses);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    navigate("/"); // Redirect to Wlcm.jsx after logout
  };

  // Navigation Handlers
  const goToProfitLoss = () => navigate("/profit-loss");
  const goToBalanceSheet = () => navigate("/balance-sheet");
  const goToPettyCash = () => navigate("/petty-cash");

  // Handle loading and error states
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{`Error: ${error}`}</div>;

  // Bar Chart data
  const chartData = {
    labels: ["Revenue", "Expenses"],
    datasets: [
      {
        label: "Total Income vs Expenses",
        data: [revenue, expenses],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Income vs Expenses",
        font: {
          size: 18,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="w-full bg-blue-600 p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-3xl font-semibold">Finance Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-800 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Subheader Section */}
      <div className="bg-white p-4 shadow-md flex justify-center space-x-4">
        <button
          onClick={goToProfitLoss}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-900"
        >
          Profit-Loss Statement
        </button>
        
        <button
          onClick={goToPettyCash}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-900"
        >
          Petty Cash
        </button>

        <button
          onClick={goToBalanceSheet}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-900"
        >
          Balance Sheet
        </button>
      </div>

      {/* Main Content Section */}
      <main className="container mx-auto p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {/* Total Revenue Card */}
          <div className="left-al bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">RS. {revenue}</p>
          </div>

          {/* Total Expense Card */}
          <div className=" bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">RS. {expenses}</p>
          </div>

        
        </div>

        {/* Bar Graph */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;
