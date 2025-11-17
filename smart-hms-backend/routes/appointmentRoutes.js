const express = require('express');
const router = express.Router();
const { getAppointments, bookAppointment } = require('../controllers/appointmentController');

router.get('/', getAppointments);
router.post('/', bookAppointment);

module.exports = router;
