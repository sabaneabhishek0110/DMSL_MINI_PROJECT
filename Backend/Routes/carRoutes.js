const express = require('express');
const router = express.Router();
const carController = require('../Controllers/carController');
const { authenticate, authorize } = require('../Middlewares/authMiddleware');

// Public routes
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), carController.createCar);
router.put('/:id', authenticate, authorize(['admin']), carController.updateCar);
router.delete('/:id', authenticate, authorize(['admin']), carController.deleteCar);

// Protected routes (authenticated users)
router.get('/available', authenticate, carController.getAvailableCars);

module.exports = router;