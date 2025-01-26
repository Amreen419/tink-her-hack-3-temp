
/*// SOS Button functionality (trigger emergency message)
function sendSOS() {
    document.getElementById("statusMessage").innerHTML = "Sending SOS... Please wait.";

    // Simulate sending SOS message (e.g., send email or call API)
    setTimeout(() => {
        document.getElementById("statusMessage").innerHTML = "SOS Sent! Help is on the way!";
    }, 2000);  // Simulate network delay
}

// Appointment form submission
document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('appointmentDate').value;

    // Basic validation: Ensure both doctor and date are selected
    if (!doctor || !date) {
        alert("Please select a doctor and appointment date.");
    } else {
        alert(`Appointment booked with ${doctor} on ${date}`);
    }
});

// Sample patient data
const loggedInPatient = {
    name: "Jane Smith",
    age: 29,
    gender: "Female",
    photo: "https://via.placeholder.com/50", // Replace with actual photo URL
};

// Function to display patient profile
function displayPatientProfile(patient) {
    const profilePhoto = document.getElementById("profile-photo");
    const profileName = document.getElementById("profile-name");
    const profileDetails = document.getElementById("profile-details");

    // Update profile data
    profilePhoto.src = patient.photo;
    profileName.textContent = patient.name;
    profileDetails.textContent = `Age: ${patient.age} | ${patient.gender}`;
}

// Ensure DOM is fully loaded before executing displayPatientProfile
document.addEventListener('DOMContentLoaded', function() {
    displayPatientProfile(loggedInPatient);
});
*/

class AuthManager {
    static async login(email, password) {
        try {
            const response = await fetch('/api/patients/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('patient', JSON.stringify(data.patient));
            return data.patient;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('patient');
        window.location.href = '/login.html';
    }
}

class MedicalProfileManager {
    static async updateProfile(profileData) {
        const patientId = JSON.parse(localStorage.getItem('patient')).id;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`/api/patients/${patientId}/medical-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                throw new Error('Profile update failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Medical Profile Update Error:', error);
            alert('Could not update medical profile.');
        }
    }
}

// Emergency SOS Functionality
async function sendSOS() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            try {
                const patientId = JSON.parse(localStorage.getItem('patient')).id;
                const response = await fetch(`/api/patients/${patientId}/emergency`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ location })
                });

                const result = await response.json();
                document.getElementById('sosStatus').textContent = 
                    'Emergency alert sent! Help is on the way.';
            } catch (error) {
                document.getElementById('sosStatus').textContent = 
                    'Could not send emergency alert.';
            }
        });
    }
}

// Event Listeners
document.getElementById('sosButton')?.addEventListener('click', sendSOS);
// Interactivity for Offerings Section
document.querySelectorAll('.offering-item').forEach((item) => {
    item.addEventListener('click', () => {
        alert(`You selected: ${item.querySelector('h3').textContent}`);
    });
});

// Interactivity for Specialties Section
document.querySelectorAll('.specialty-item').forEach((item) => {
    item.addEventListener('click', () => {
        alert(`Learn more about ${item.querySelector('h3').textContent} specialists!`);
    });
});
