const express = require('express');
const {
    createPettyCtrl,
    fetchAllPettyCtrl,
    fetchPettyDetailsCtrl,
    updatePettyCtrl,
    deletePettyCtrl,
    getTotalPetty
} = require('../../controllers/income/pettycashCtrl.js');

const authMiddleware = require('../../middlewares/authMiddleware.js');

const pettyRoute = express.Router();


pettyRoute.post('/', authMiddleware, createPettyCtrl);


pettyRoute.get('/', authMiddleware, fetchAllPettyCtrl);



pettyRoute.get('/total', authMiddleware, getTotalPetty);


pettyRoute.get('/:id', authMiddleware, fetchPettyDetailsCtrl);


pettyRoute.put('/:id', authMiddleware, updatePettyCtrl);


pettyRoute.delete('/:id', authMiddleware, deletePettyCtrl);

module.exports = pettyRoute;
