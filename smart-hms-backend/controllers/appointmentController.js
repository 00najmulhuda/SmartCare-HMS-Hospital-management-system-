const Appointment = require('../models/Appointment');
const transporter = require('../utils/mailer');

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('getAppointments error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { patientName, doctorName, date, time } = req.body;

    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const appointment = new Appointment({ patientName, doctorName, date, time });
    const saved = await appointment.save();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [
        "nh5037480@gmail.com",
        "000najmulhuda@gmail.com",
        "innocantr@gmail.com"
      ]
      subject: "New Appointment Booked",
      html: `
        <h2>New Appointment Details</h2>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      `
    };

    transporter.sendMail(mailOptions)
      .then(() => console.log("📩 Appointment email sent"))
      .catch(err => console.log("📛 Email sending failed:", err.message));

    res.status(201).json(saved);
  } catch (err) {
    console.error('bookAppointment error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
