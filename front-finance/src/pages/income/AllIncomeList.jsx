import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import baseURL from '../../utils/baseURL';
import { jsPDF } from 'jspdf';

const IncomeList = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { userAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuth?.token) {
      fetchIncome(userAuth.token, page);
    }
  }, [userAuth?.token, page]);

  useEffect(() => {
    if (searchQuery) {
      // Filter income list based on search query
      const filtered = incomeList.filter((inc) =>
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.amount.toString().includes(searchQuery)
      );
      setFilteredIncome(filtered);
    } else {
      setFilteredIncome(incomeList); // Show all income if search query is empty
    }
  }, [searchQuery, incomeList]);

  const fetchIncome = async (token, page) => {
    try {
      const response = await fetch(`${baseURL}/income?page=${page}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch income transactions');

      const data = await response.json();
      setIncomeList(data.docs || []);
      setFilteredIncome(data.docs || []); // Initially, no filter is applied
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteIncome = async (incomeId) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return;

    try {
      const response = await fetch(`${baseURL}/income/${incomeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userAuth?.token}` },
      });

      if (!response.ok) throw new Error('Failed to delete income');

      setIncomeList(incomeList.filter((inc) => inc._id !== incomeId));
      setFilteredIncome(filteredIncome.filter((inc) => inc._id !== incomeId)); // Update filtered income as well
      alert('Income deleted successfully!');
    } catch (err) {
      alert(`Error deleting income: ${err.message}`);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Income Transactions List', 14, 10);
    doc.setLineWidth(0.5);
    doc.line(14, 12, 200, 12);

    doc.setFontSize(12);
    doc.text('Received By', 14, 20);
    doc.text('Title', 70, 20);
    doc.text('Amount', 140, 20);
    doc.text('Date', 180, 20);
    doc.line(14, 22, 200, 22);

    let rowY = 30;
    filteredIncome.forEach((inc, index) => {
      const userName = inc.user ? `${inc.user.firstname} ${inc.user.lastname || ''}` : 'Unknown';
      doc.text(userName, 14, rowY);
      doc.text(inc.title, 70, rowY);
      doc.text(`RS.${inc.amount}`, 140, rowY);
      doc.text(new Date(inc.date).toLocaleDateString(), 180, rowY);
      rowY += 10;
      if (index !== filteredIncome.length - 1) {
        doc.line(14, rowY + 2, 200, rowY + 2);
      }
    });

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, rowY + 10);
    doc.save('income-list.pdf');
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <section className="py-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="pt-8 px-8 flex justify-between items-center">
            <div>
              <h6 className="text-3xl font-semibold">Recent Income Transactions</h6>
              <p className="text-lg text-gray-600">Below is the history of your income transactions.</p>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              onClick={generatePDF}
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

          <table className="table-auto w-full text-left mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Received By</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-xl py-6 text-gray-500">No Income Records Found</td>
                </tr>
              ) : (
                filteredIncome.map((inc) => (
                  <tr key={inc._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{inc.user?.firstname} {inc.user?.lastname || 'Unknown'}</td>
                    <td className="px-4 py-2">{inc.title}</td>
                    <td className="px-4 py-2">{inc.description}</td>
                    <td className="px-4 py-2">RS.{inc.amount}</td>
                    <td className="px-4 py-2">{new Date(inc.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => navigate(`/update-income/${inc._id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
          <div className="flex justify-between py-4 px-8">
            <button 
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-lg"
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="self-center text-lg">Page {page}</span>
            <button 
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-lg"
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

export default IncomeList;
