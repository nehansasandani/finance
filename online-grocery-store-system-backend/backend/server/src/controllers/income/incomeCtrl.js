const expressAsyncHandler = require('express-async-handler');
const Income = require("../../model/income");

// Create income
const createIncCtrl = expressAsyncHandler(async (req, res) => {
    const { title, description, amount, user } = req?.body;
    try {
        const income = await Income.create({ title, description, amount, user });
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all income
const fetchAllIncCtrl = expressAsyncHandler(async (req, res) => {
    const { page } = req.query;
    try {
        const income = await Income.paginate({}, { limit: 10, page: Number(page), populate: "user" });
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch single income
const fetchIncDetailsCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const income = await Income.findById(id);
        if (!income) {
            res.status(404).json({ message: 'Income not found' });
        } else {
            res.status(200).json(income);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update income
const updateIncCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, amount } = req.body;

    try {
        const income = await Income.findByIdAndUpdate(
            id,
            { title, description, amount },
            { new: true }
        );
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete income
const deleteIncCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const income = await Income.findByIdAndDelete(id);
        if (!income) {
            res.status(404).json({ message: 'Income not found' });
        } else {
            res.status(200).json({ message: 'Income deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getTotalIncome = expressAsyncHandler(async (req, res) => {
    try {
        const totalIncome = await Income.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        res.status(200).json({ totalIncome: totalIncome[0]?.total || 0 });
    } catch (error) {
        console.error("Error fetching total income:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = { createIncCtrl, fetchAllIncCtrl, fetchIncDetailsCtrl, updateIncCtrl, deleteIncCtrl, getTotalIncome };