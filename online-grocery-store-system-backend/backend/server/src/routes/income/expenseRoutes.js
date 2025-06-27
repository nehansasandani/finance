const express = require('express');
const {
    createExpCtrl,
    fetchAllExpCtrl,
    fetchExpIDetailsCtrl,
    getTotalExpense,
    updateExpCtrl,
    deleteExpCtrl
} = require('../../controllers/income/expenseCtrl.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');

const expenseRoute = express.Router();

expenseRoute.post('/', authMiddleware, createExpCtrl);
expenseRoute.get('/', authMiddleware, fetchAllExpCtrl);
expenseRoute.get('/total', authMiddleware, getTotalExpense);
expenseRoute.get('/:id', authMiddleware, fetchExpIDetailsCtrl);
expenseRoute.put('/:id', authMiddleware, updateExpCtrl);
expenseRoute.delete('/:id', authMiddleware, deleteExpCtrl);

module.exports = expenseRoute;