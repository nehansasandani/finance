import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Grocery Store Image - Full Width */}
      <img 
        src="/grocery.jpg" 
        alt="Grocery Store" 
        className="w-full h-auto mb-4 object-cover"
      />

      <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome to Quick Cart</h1>
      <p className="text-lg text-gray-700 mb-6">Your one-stop online grocery store.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-500">Fresh Vegetables</h2>
          <p className="text-gray-600">Get farm-fresh vegetables delivered to your doorstep.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-500">Dairy Products</h2>
          <p className="text-gray-600">High-quality dairy products for your daily needs.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-500">Household Essentials</h2>
          <p className="text-gray-600">Shop for groceries, cleaning supplies, and more.</p>
        </div>
      </div>

      <button className="mt-8 bg-green-500 text-white text-xl px-8 py-3 rounded-lg hover:bg-gray-700 transition">
        Start Shopping
      </button>


      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <button className="w-full py-4 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition">
          Login as a Customer
        </button>
        <button className="w-full py-4 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition">
          Login as a Seller
        </button>
        <button className="w-full py-4 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition">
          Login as an Inventory Manager
        </button>
        <button className="w-full py-4 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition">
          Login as an HR Manager
        </button>
        <button 
          onClick={() => navigate('/welcome')}
          className="w-full py-4 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition">
          Login as a Finance Member
        </button>
      </div>
    </div>
  );
};

export default Home;
