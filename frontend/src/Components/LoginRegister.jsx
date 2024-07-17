import React, { useState } from 'react';
import './LoginRegister.css';

const LoginRegister = ({ onLogin }) => {
    const[action, setAction] = useState('');

    const registerLink = () => {
        setAction('activate');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Perform your login logic here, then call onLogin
        onLogin();
      };
    
      const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // Perform your registration logic here
      };

    return (
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Login</h1>
                    <div className="input_box">
                        <input type="text" placeholder='Username'required/>
                    </div>
                    <div className="input_box">
                        <input type="password" placeholder='Password'required/>
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link"></div>
                    <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Registration</h1>
                    <div className="input_box">
                        <input type="text" placeholder='First Name'required/>
                    </div>
                    <div className="input_box">
                        <input type="text" placeholder='Last Name'required/>
                    </div>
                    <div className="input_box">
                        <input type="text" placeholder='Username'required/>
                    </div>
                    <div className="input_box">
                        <input type="email" placeholder='Email'required/>
                    </div>
                    <div className="input_box">
                        <input type="password" placeholder='Password'required/>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link"></div>
                    <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                </form>
            </div>

        </div>
    );
};

export default LoginRegister; 