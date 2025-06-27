const expressAsyncHandler = require('express-async-handler');
const Expense = require('../../model/expenses');

//create

const createExpCtrl = expressAsyncHandler(async (req, res) => {
    const { title, description, amount,user } = req?.body;
    try {
        const expense = await Expense.create({ title, description, amount, user});
        res.status(200).json(expense);
    } catch (error) {
        res.json(error);
    }
});


// Fetch all income
const fetchAllExpCtrl = expressAsyncHandler(async (req, res) => {
   const {page}=req.query;
    try {
        const expense = await Expense.paginate({},{limit:10,page:Number(page),populate:"user"});
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch single income
const fetchExpIDetailsCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
        } else {
            res.status(200).json(expense);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get total expenses
const getTotalExpense = expressAsyncHandler(async (req, res) => {
    try {
        const totalExpense = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        res.status(200).json({ totalExpenses: totalExpense[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

//update
const updateExpCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, amount} = req.body;
 
 
   try { 
    const expense = await Expense.findByIdAndUpdate(
         id,{ title, description, amount},
    { new: true }
    );
    res.json(expense);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

//delete
const deleteExpCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
        } else {
            res.status(200).json(expense);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = { createExpCtrl, fetchAllExpCtrl, fetchExpIDetailsCtrl, updateExpCtrl, deleteExpCtrl, getTotalExpense };