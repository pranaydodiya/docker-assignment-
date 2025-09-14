from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/")
def helloworld():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Flask Backend API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f0f0f0; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Flask Backend API</h1>
            <p>Welcome to the Flask backend server!</p>
            <div class="info">
                <h3>Available Endpoints:</h3>
                <ul>
                    <li><strong>POST /process</strong> - Process form data from frontend</li>
                    <li><strong>GET /health</strong> - Health check endpoint</li>
                    <li><strong>GET /users</strong> - Get all processed users</li>
                </ul>
            </div>
            <p>This backend is designed to work with the Node.js frontend on port 3000.</p>
        </div>
    </body>
    </html>
    """
    return render_template_string(html_content)

# In-memory storage for demonstration (in production, use a database)
users_data = []

@app.route('/process', methods=['POST'])
def process():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'age', 'gender', 'country', 'occupation']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Process the data
        processed_data = {
            'id': len(users_data) + 1,
            'name': data['name'],
            'email': data['email'],
            'age': int(data['age']),
            'gender': data['gender'],
            'country': data['country'],
            'occupation': data['occupation'],
            'interests': data.get('interests', []),
            'bio': data.get('bio', ''),
            'timestamp': datetime.now().isoformat()
        }
        
        # Store the data
        users_data.append(processed_data)
        
        # Prepare response
        response_data = {
            "message": f"Hello {data['name']}! Your data has been processed successfully.",
            "user_id": processed_data['id'],
            "processed_data": processed_data,
            "total_users": len(users_data)
        }
        
        print(f"Processed user data: {processed_data}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error processing data: {str(e)}")
        return jsonify({
            "error": f"Error processing data: {str(e)}"
        }), 500

@app.route('/users', methods=['GET'])
def get_users():
    """Get all processed users"""
    return jsonify({
        "users": users_data,
        "total": len(users_data)
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "OK",
        "service": "Flask Backend",
        "timestamp": datetime.now().isoformat(),
        "users_processed": len(users_data)
    })

if __name__ == '__main__':
    print("Starting Flask backend server...")
    print("Backend will be available at: http://localhost:5000")
    print("Frontend should connect to: http://localhost:3000")
    app.run(host='0.0.0.0', port=5000, debug=True)
