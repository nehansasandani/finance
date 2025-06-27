import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BalanceSheet = () => {
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [equity, setEquity] = useState([]);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    // Static sample data
    const sampleAssets = [
      { name: 'Cash', amount: 50000 },
      { name: 'Accounts Receivable', amount: 30000 },
      { name: 'Inventory', amount: 20000 },
      { name: 'Property, Plant & Equipment', amount: 150000 },
    ];

    const sampleLiabilities = [
      { name: 'Accounts Payable', amount: 25000 },
      { name: 'Short-term Loans', amount: 40000 },
      { name: 'Long-term Debt', amount: 60000 },
    ];

    const sampleEquity = [
      { name: 'Common Stock', amount: 50000 },
      { name: 'Retained Earnings', amount: 75000 },
    ];

    setAssets(sampleAssets);
    setLiabilities(sampleLiabilities);
    setEquity(sampleEquity);
    setLoading(false);
  }, []);

  const calculateTotal = (items) =>
    items.reduce((total, item) => total + (item.amount || 0), 0);

  const generatePDF = () => {
    const input = componentRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('balance-sheet.pdf');
    });
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  const totalAssets = calculateTotal(assets);
  const totalLiabilities = calculateTotal(liabilities);
  const totalEquity = calculateTotal(equity);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>
      <div ref={componentRef} className="bg-white p-6 rounded shadow">
        <h2 className="text-3xl font-bold text-center mb-6">Balance Sheet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assets */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Assets</h3>
            <ul>
              {assets.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>Rs. {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold">
              Total Assets: Rs. {totalAssets.toFixed(2)}
            </div>
          </div>

          {/* Liabilities */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Liabilities</h3>
            <ul>
              {liabilities.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>Rs. {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold">
              Total Liabilities: Rs. {totalLiabilities.toFixed(2)}
            </div>
          </div>

          {/* Equity */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Equity</h3>
            <ul>
              {equity.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>Rs. {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold">
              Total Equity: Rs. {totalEquity.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p>
            Total Liabilities + Equity: Rs. {(totalLiabilities + totalEquity).toFixed(2)}
          </p>
          <p>
            Difference (Assets - (Liabilities + Equity)): Rs. {(totalAssets - totalLiabilities - totalEquity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
