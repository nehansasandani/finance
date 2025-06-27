import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const IncomeL = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const { userAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth?.token) {
      fetchIncomes(userAuth.token, page);
    }
  }, [userAuth, page]);

  // ✅ Fetch income records from backend
const fetchIncomes = async (token, page) => {
    setLoading(true);  // Start loading before fetching data
    setError(null);    // Clear any existing errors
  
    try {
      const response = await fetch(`http://localhost:8081/api/income?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch income records");
      }
  
      const data = await response.json();
  
      if (userAuth && userAuth._id) {
        // Filter the data for the logged-in user if userAuth is present
        const filteredIncomes = data.docs.filter(
          (income) => income.user && income.user._id === userAuth._id
        );
        setIncomes(filteredIncomes);  // Set the filtered incomes to state
      } else {
        setIncomes([]);  // If no user is authenticated, set incomes to empty
      }
  
      setLoading(false);  // End loading after data is fetched
    } catch (err) {
      setError(err.message);  // Set error if the fetch fails
      setLoading(false);      // End loading if an error occurs
    }
  };
  

  // ✅ Delete an income record
  const deleteIncome = async (incomeId) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      const response = await fetch(`http://localhost:8081/api/income/${incomeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userAuth?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      setIncomes(incomes.filter((inc) => inc._id !== incomeId));
      alert("Income deleted successfully!");
    } catch (err) {
      alert(`Error deleting income: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-6">
      <div className="container-fluid">
        <div className="position-relative border rounded-2">
          <div className="pt-8 px-8 mb-8">
            <h6 className="mb-0 fs-3">Recent Income Transactions</h6>
            <p className="mb-0">Below is the history of your income transactions.</p>
            <Link to="/new-income" className="btn btn-outline-primary me-2 m-2">
              New Income
            </Link>
          </div>

          <table className="table">
            <thead>
              <tr className="table-active">
                <th>Received By</th>
                <th>Title</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <h2>No Income Records Found</h2>
                  </td>
                </tr>
              ) : (
                incomes.map((inc) => (
                  <tr key={inc._id}>
                    <td>{inc.user?.firstname} {inc.user?.lastname || "Unknown"}</td>
                    <td>{inc.title}</td>
                    <td>{inc.description}</td>
                    <td>RS.{inc.amount}</td>
                    <td>{new Date(inc.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline-success me-2"
                        onClick={() => navigate(`/update-income/${inc._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deleteIncome(inc._id)}
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

export default IncomeL;
