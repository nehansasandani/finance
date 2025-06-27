import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to get user authentication data
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track current page

  const { userAuth } = useSelector((state) => state.user); // Get the user authentication token from Redux
  const navigate = useNavigate(); // Define the navigate function

  // Fetch expenses when the component mounts or when userAuth.token or page changes
  useEffect(() => {
    if (userAuth?.token) {
      fetchExpenses(userAuth.token, page);
    }
  }, [userAuth, page]); // Add page as dependency to fetch new page data

  // ✅ Fetch expenses from the backend API
  const fetchExpenses = async (token, page) => {
    try {
      const response = await fetch(`http://localhost:8081/api/expenses?page=${page}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the header for authorization
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();

      // Ensure userAuth exists and has _id before attempting to filter
      if (userAuth && userAuth._id) {
        // Filter the expenses to only include the ones that belong to the logged-in user
        const filteredExpenses = data.docs.filter(expense => expense.user && expense.user._id === userAuth._id);
        setExpenses(filteredExpenses); // Set the filtered expenses
      } else {
        // If userAuth is not available or _id is not present, clear the expenses list
        setExpenses([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ✅ Function to Delete an Expense
  const deleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

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

      // ✅ Remove deleted expense from state
      setExpenses(expenses.filter((exp) => exp._id !== expenseId));

      alert("Expense deleted successfully!");
    } catch (err) {
      alert(`Error deleting expense: ${err.message}`);
    }
  };

  // ✅ Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-6">
      <div className="container-fluid">
        <div className="position-relative border rounded-2">
          <div className="pt-8 px-8 mb-8">
            <h6 className="mb-0 fs-3">Recent Expense Transactions</h6>
            <p className="mb-0">
              Below is the history of your expense transactions records.
            </p>
            <Link to="/new-expense" className="btn btn-outline-danger me-2 m-2">
              New Expense
            </Link>
          </div>

          <table className="table">
            <thead>
              <tr className="table-active">
                <th>Withdrawn By</th>
                <th>Title</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <h2>No Expenses Found</h2>
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.user?.firstname} {exp.user?.lastname || "Unknown"}</td>
                    <td>{exp.title}</td>
                    <td>{exp.description}</td>
                    <td>RS.{exp.amount}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
                      {/* Edit button */}
                      <button 
                        className="btn btn-outline-primary me-2"
                        onClick={() => navigate(`/update-expense/${exp._id}`)}
                      >
                        Edit
                      </button>
                      
                      {/* Delete button */}
                      <button 
                        className="btn btn-outline-danger"
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
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button 
              className="btn btn-outline-secondary"
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
