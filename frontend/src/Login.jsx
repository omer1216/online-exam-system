import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert data to "Form Data" format (Required by OAuth2)
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            // Send request to your FastAPI Backend
            const response = await axios.post("http://127.0.0.1:8000/token", formData);
            
            // If successful, save the token and move to Dashboard
            const token = response.data.access_token;
            localStorage.setItem("exam_token", token);
            setToken(token);
            navigate("/dashboard");
            
        } catch (err) {
            console.error(err);
            setError("Invalid username or password!");
        }
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Login to Exam System</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
                <div>
                    <label>Username:</label><br/>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <br/>
                <div>
                    <label>Password:</label><br/>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;