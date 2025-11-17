const express = require('express'); 
const router = express.Router();
const { getAllDoctors, addDoctor } = require('../controllers/doctorController');

router.get('/', getAllDoctors);
router.post('/', addDoctor);

module.exports = router;
