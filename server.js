/*
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const patientRoutes = require('/routes/patientRoutes');
const appointmentRoutes = require('/routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/doctron', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB: ', err));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
*/

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const patientRoutes = require('/routes/patientRoutes');
const appointmentRoutes = require('/routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

