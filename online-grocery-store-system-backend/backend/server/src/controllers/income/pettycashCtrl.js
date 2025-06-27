const expressAsyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Petty = require("../../model/petty");

// Create petty cash
const createPettyCtrl = expressAsyncHandler(async (req, res) => {
    const { amount, paidTo, category, description } = req.body;

    // Basic validation
    if (!amount || !paidTo || !category || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const petty = await Petty.create({ amount, paidTo, category, description });
        res.status(201).json(petty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch all petty cash records (with pagination)
const fetchAllPettyCtrl = expressAsyncHandler(async (req, res) => {
    const currentPage = Number(req.query.page) || 1;
    try {
        const petty = await Petty.paginate({}, {
            limit: 10,
            page: currentPage
            
        });
        res.status(200).json(petty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch single petty cash record
const fetchPettyDetailsCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const petty = await Petty.findById(id);
        if (!petty) {
            return res.status(404).json({ message: 'Petty cash record not found' });
        }
        res.status(200).json(petty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update petty cash record
const updatePettyCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, paidTo, category, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const updatedPetty = await Petty.findByIdAndUpdate(
            id,
            { amount, paidTo, category, description },
            { new: true, runValidators: true }
        );
        if (!updatedPetty) {
            return res.status(404).json({ message: "Petty cash record not found" });
        }
        res.status(200).json(updatedPetty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete petty cash record
const deletePettyCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const deletedPetty = await Petty.findByIdAndDelete(id);
        if (!deletedPetty) {
            return res.status(404).json({ message: "Petty cash record not found" });
        }
        res.status(200).json({ message: "Petty cash record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get total petty cash amount
const getTotalPetty = expressAsyncHandler(async (req, res) => {
    try {
        const totalPettyCash = await Petty.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        res.status(200).json({ totalPettyCash: totalPettyCash[0]?.total || 0 });
    } catch (error) {
        console.error("Error fetching total petty cash:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = {
    createPettyCtrl,
    fetchAllPettyCtrl,
    fetchPettyDetailsCtrl,
    updatePettyCtrl,
    deletePettyCtrl,
    getTotalPetty
};
