const express = require('express');
const router = express.Router();
const rentalController = require('../Controllers/rentalController');
const { authenticate,authorize } = require('../Middlewares/authMiddleware');

// Protected routes
router.post('/', authenticate, rentalController.createRental);
router.get('/', authenticate, rentalController.getUserRentals);
router.get('/:id', authenticate, rentalController.getRentalById);
router.put('/:id/cancel', authenticate, rentalController.cancelRental);

// Admin routes
router.get('/admin/all', authenticate, authorize(['admin']), rentalController.getAllRentals);
router.put('/admin/:id/status', authenticate, authorize(['admin']), rentalController.updateRentalStatus);

module.exports = router;