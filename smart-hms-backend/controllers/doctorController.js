const Doctor = require('../models/doctor');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    // fix: convert _id → id (frontend expects `id`)
    const formatted = doctors.map(d => ({
      id: d._id,
      name: d.name,
      specialization: d.specialization,
      experience: d.experience
    }));

    res.json(formatted);
  } catch (err) {
    console.error('getAllDoctors error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (err) {
    console.error('addDoctor error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
