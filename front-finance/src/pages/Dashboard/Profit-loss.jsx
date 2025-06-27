import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import baseURL from "../../utils/baseURL";
import { jsPDF } from "jspdf";

const ProfitLossStatement = () => {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userAuth = useSelector((state) => state.user.userAuth);

  useEffect(() => {
    if (userAuth?.token) {
      fetchFinancialData(userAuth.token);
    }
  }, [userAuth]);

  const fetchFinancialData = async (token) => {
    try {
      const incomeResponse = await fetch(`${baseURL}/income/total`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const expenseResponse = await fetch(`${baseURL}/expenses/total`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!incomeResponse.ok || !expenseResponse.ok) {
        throw new Error("Failed to fetch financial details");
      }

      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();

      const totalIncome = incomeData.totalIncome || 0;
      const totalExpenses = expenseData.totalExpenses || 0;
      const netProfitLoss = totalIncome - totalExpenses;

      setRevenue(totalIncome);
      setExpenses(totalExpenses);
      setProfitLoss(netProfitLoss);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    doc.setFontSize(20);
    doc.text("Profit & Loss Statement", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Category", 20, 40);
    doc.text("Amount (RS.)", 140, 40);

    doc.text("Total Revenue", 20, 50);
    doc.text(`RS. ${revenue}`, 140, 50);
    doc.text("Total Expenses", 20, 60);
    doc.text(`RS. ${expenses}`, 140, 60);
    doc.text("Net Profit/Loss", 20, 70);
    doc.text(`${profitLoss >= 0 ? "Profit" : "Loss"}: RS. ${Math.abs(profitLoss)}`, 140, 70);

    doc.save("profit_loss_statement.pdf");
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{`Error: ${error}`}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-blue-600 p-6 shadow-lg flex justify-between items-center">
        <h1 className="text-white text-3xl font-semibold">Profit & Loss Statement</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Profit/Loss</h3>
          <p className={`text-2xl font-bold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            {profitLoss >= 0 ? "Profit" : "Loss"}: RS. {Math.abs(profitLoss)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Profit-Loss Statement</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Category</th>
                <th className="border p-3 text-right">Amount (RS.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Total Revenue</td>
                <td className="border p-3 text-right text-green-600">{revenue}</td>
              </tr>
              <tr>
                <td className="border p-3">Total Expenses</td>
                <td className="border p-3 text-right text-red-600">{expenses}</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">Net Profit/Loss</td>
                <td className={`border p-3 text-right ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {profitLoss >= 0 ? "Profit" : "Loss"}: RS. {Math.abs(profitLoss)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={generatePDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
          >
            Download PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfitLossStatement;
