const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the main form page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flask Assignment 2 - Frontend Form</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #555;
            }
            input[type="text"], input[type="email"], input[type="number"], select, textarea {
                width: 100%;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                box-sizing: border-box;
            }
            input[type="text"]:focus, input[type="email"]:focus, input[type="number"]:focus, select:focus, textarea:focus {
                outline: none;
                border-color: #4CAF50;
            }
            button {
                background-color: #4CAF50;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
                margin-top: 10px;
            }
            button:hover {
                background-color: #45a049;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                display: none;
            }
            .success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .loading {
                text-align: center;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Flask Assignment 2 - User Registration Form</h1>
            <form id="userForm">
                <div class="form-group">
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="age">Age:</label>
                    <input type="number" id="age" name="age" min="1" max="120" required>
                </div>
                
                <div class="form-group">
                    <label for="gender">Gender:</label>
                    <select id="gender" name="gender" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="country">Country:</label>
                    <input type="text" id="country" name="country" required>
                </div>
                
                <div class="form-group">
                    <label for="occupation">Occupation:</label>
                    <input type="text" id="occupation" name="occupation" required>
                </div>
                
                <div class="form-group">
                    <label for="interests">Interests (comma-separated):</label>
                    <textarea id="interests" name="interests" rows="3" placeholder="e.g., Programming, Music, Sports"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="bio">Bio:</label>
                    <textarea id="bio" name="bio" rows="4" placeholder="Tell us about yourself..."></textarea>
                </div>
                
                <button type="submit">Submit to Flask Backend</button>
            </form>
            
            <div id="result" class="result"></div>
        </div>

        <script>
            document.getElementById('userForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // Convert interests string to array
                if (data.interests) {
                    data.interests = data.interests.split(',').map(interest => interest.trim()).filter(interest => interest);
                }
                
                const resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.className = 'result loading';
                resultDiv.innerHTML = 'Sending data to Flask backend...';
                
                try {
                    const response = await fetch('/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        resultDiv.className = 'result success';
                        resultDiv.innerHTML = \`
                            <h3>Success!</h3>
                            <p><strong>Backend Response:</strong> \${result.message}</p>
                            <p><strong>Data Sent:</strong></p>
                            <ul>
                                <li><strong>Name:</strong> \${data.name}</li>
                                <li><strong>Email:</strong> \${data.email}</li>
                                <li><strong>Age:</strong> \${data.age}</li>
                                <li><strong>Gender:</strong> \${data.gender}</li>
                                <li><strong>Country:</strong> \${data.country}</li>
                                <li><strong>Occupation:</strong> \${data.occupation}</li>
                                <li><strong>Interests:</strong> \${data.interests.join(', ')}</li>
                                <li><strong>Bio:</strong> \${data.bio}</li>
                            </ul>
                        \`;
                    } else {
                        throw new Error(result.error || 'Unknown error occurred');
                    }
                } catch (error) {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = \`
                        <h3>Error!</h3>
                        <p><strong>Error:</strong> \${error.message}</p>
                        <p>Make sure the Flask backend is running on port 5000.</p>
                    \`;
                }
            });
        </script>
    </body>
    </html>
    `);
});

// Handle form submission to Flask backend
app.post('/submit', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        
        const response = await axios.post(\`\${FLASK_BACKEND_URL}/process\`, req.body, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        console.log('Flask backend response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with Flask backend:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            res.status(500).json({ 
                error: 'Cannot connect to Flask backend. Make sure it is running on port 5000.' 
            });
        } else if (error.response) {
            res.status(error.response.status).json({ 
                error: error.response.data.message || 'Backend error occurred' 
            });
        } else {
            res.status(500).json({ 
                error: 'Internal server error: ' + error.message 
            });
        }
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Node.js Frontend',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Node.js frontend server running on port \${PORT}\`);
    console.log(\`Flask backend URL: \${FLASK_BACKEND_URL}\`);
});

