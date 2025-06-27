import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { userAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth?.token) {
      fetchExpenses(userAuth.token, page);
    }
  }, [userAuth, page]);

  // Fetch Expenses Function
  const fetchExpenses = async (token, page) => {
    try {
      const response = await fetch(`http://localhost:8081/api/expenses?page=${page}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      setExpenses(data.docs || []);
      setFilteredExpenses(data.docs || []); // Initialize with all expenses
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle search query and filter expenses
  useEffect(() => {
    if (searchQuery) {
      const filtered = expenses.filter((exp) =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.amount.toString().includes(searchQuery)
      );
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses); // Show all expenses if search query is empty
    }
  }, [searchQuery, expenses]);

  // Delete Expense Function
  const deleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`http://localhost:8081/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userAuth?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      // Remove deleted expense from state
      setExpenses(expenses.filter((exp) => exp._id !== expenseId));
      setFilteredExpenses(filteredExpenses.filter((exp) => exp._id !== expenseId)); // Update filtered expenses
      alert('Expense deleted successfully!');
    } catch (err) {
      alert(`Error deleting expense: ${err.message}`);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);

    doc.text('Expense Transactions List', 14, 10);
    doc.setLineWidth(0.5);
    doc.line(14, 12, 200, 12);

    doc.setFontSize(12);
    doc.text('Withdrawn By', 14, 20);
    doc.text('Title', 60, 20);
    doc.text('Amount', 160, 20);
    doc.text('Date', 180, 20);
    doc.setLineWidth(0.5);
    doc.line(14, 22, 200, 22);

    let rowY = 30;
    filteredExpenses.forEach((exp) => {
      doc.text(`${exp.user?.firstname} ${exp.user?.lastname || 'Unknown'}`, 14, rowY);
      doc.text(exp.title, 60, rowY);
      doc.text(`RS.${exp.amount}`, 160, rowY);
      doc.text(new Date(exp.date).toLocaleDateString(), 180, rowY);
      rowY += 10;
      if (rowY < 270) {
        doc.line(14, rowY + 2, 200, rowY + 2);
      }
    });

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, rowY + 10);
    doc.save('expenses-list.pdf');
  };

  // Handle loading and error states
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{`Error: ${error}`}</div>;

  return (
    <section className="py-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="pt-8 px-8 mb-8">
            <h6 className="mb-0 text-3xl font-semibold">Recent Expense Transactions</h6>
            <p className="mb-4 text-lg">Below is the history of your expense transactions records.</p>
            <Link
              to="/new-expense"
              className="btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
            >
              New Expense
            </Link>

            {/* Generate PDF Button */}
            <button
              onClick={generatePDF}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out mt-4"
            >
              Generate PDF
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-8 py-4">
            <input
              type="text"
              placeholder="Search by Title, Description, or Amount"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Withdrawn By</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 min-w-[200px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-xl py-6">
                    <h2 className="text-gray-500">No Expenses Found</h2>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {exp.user?.firstname} {exp.user?.lastname || 'Unknown'}
                    </td>
                    <td className="px-4 py-2">{exp.title}</td>
                    <td className="px-4 py-2">{exp.description}</td>
                    <td className="px-4 py-2">RS.{exp.amount}</td>
                    <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                        onClick={() => navigate(`/update-expense/${exp._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
                        onClick={() => deleteExpense(exp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between py-4 px-8">
            <button
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="self-center text-lg">Page {page}</span>
            <button
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpensesList;
