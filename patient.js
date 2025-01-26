

/*const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    profilePicture: { type: String, required: true }, // URL or file path for the photo
});

module.exports = mongoose.model('Patient', patientSchema);

fetch('http://localhost:5000/api/patients')
    .then(response => response.json())
    .then(data => {
        // Use the patient data in your front-end
        console.log(data);
    })
    .catch(err => console.error('Error:', err));
    */

    

    const mongoose = require('mongoose');

const medicalProfileSchema = new mongoose.Schema({
    bloodGroup: { 
        type: String, 
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] 
    },
    currentMedications: [{ type: String }],
    allergies: [{ type: String }],
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relationship: { type: String }
    }
});

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    profilePicture: { type: String },
    medicalProfile: medicalProfileSchema,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);


