/*
const express = require('express');
const Patient = require('./models/Patient');
const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new patient
router.post('/', async (req, res) => {
    const patient = new Patient({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        profilePicture: req.body.profilePicture,
    });

    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
*/

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('./models/Patient');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;
        
        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new patient
        const patient = new Patient({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            profilePicture: req.body.profilePicture || 'default-profile.jpg'
        });

        await patient.save();
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: patient._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            patient: { 
                id: patient._id, 
                name: patient.name, 
                email: patient.email 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Medical Profile
router.patch('/:id/medical-profile', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: { medicalProfile: req.body } },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient.medicalProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
