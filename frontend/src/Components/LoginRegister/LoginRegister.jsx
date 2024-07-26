import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const LoginRegister = () => {
    
    const [action, setAction] = useState('');
    const [password, setPassword] =useState('');
    const [username, setUsername] =useState('');
    const [first_name, setFirstName] =useState('');
    const [last_name, setLastName] =useState('');
    const [email, setEmail] =useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();


    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const loginPage = () => {
        setAction('');
    }
 
    const handleLogin = (event) => {
        event.preventDefault()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username,password}),
            headers: myHeaders,
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status !== "ok"){
            setErrorMessage(responseJson.message)
          }
          else{
           
            navigate("/homepage");
          }
          
        }); 


        console.log("Form is submited")
        console.log(username)
        console.log(password)
    };

    const handleRegister = (event) => {
        event.preventDefault()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ username,password,first_name,last_name,email}),
            headers: myHeaders,
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status !== "ok"){
            setErrorMessage(responseJson.message)
          }
          else{
            setAction('');
          }
        console.log("Form is submited")
        console.log(username)
        console.log(password)
          
        }); 
    }
    const updateUsername = (event) => {
        setUsername(event.target.value)
        
    };

    const updatePassword = (event) => {
        setPassword(event.target.value)
    };

    const updateFirstName = (event) => {
        setFirstName(event.target.value)
    };
    const updateLastName = (event) => {
        setLastName(event.target.value)
    };
    const updateEmail = (event) => {
        setEmail(event.target.value)
    };
    return (
        
    
    <div className="container">
        <div className="page-title">
            <h1>Passport Diaries</h1>
        </div>
        
        <div className={`wrapper${action}`}>
            
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' onChange={updateUsername} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' onChange={updatePassword} required />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>
                    {errorMessage}
                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegister}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' onChange={updateUsername} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='First Name' onChange={updateFirstName}required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='Last Name' onChange={updateLastName} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder='Email' onChange={updateEmail} required />
                        <FaEnvelope className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' onChange={updatePassword} required />
                        <FaLock className='icon' />
                    </div>

                    {/* <div className="remember-forgot">
                        <label><input type="checkbox" />I agree to the terms & conditions</label>
                    </div> */}

                    <button type="submit" onClick={loginPage}>Register</button>

                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};


export default LoginRegister;
