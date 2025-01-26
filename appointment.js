const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'Scheduled' },  // Can be 'Scheduled', 'Completed', etc.
});

module.exports = mongoose.model('Appointment', appointmentSchema);

const appointmentData = {
    patientId: '603c72ef4f1a3b32f8f9b14d', // Example patient ID
    doctor: 'Dr. Smith',
    appointmentDate: '2025-02-01T10:00:00Z'
};

fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
})
    .then(response => response.json())
    .then(data => {
        console.log('Appointment booked:', data);
    })
    .catch(error => console.error('Error:', error));
