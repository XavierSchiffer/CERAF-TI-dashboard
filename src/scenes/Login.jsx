import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaLock } from "react-icons/fa";
// import {  } from 'react-icons/fa';
import { FaUser } from "react-icons/fa";

import './Login.css';
// import React from "react";


function Login() {
    const { login, user } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = { username, email, password };
            let user;
            
            if (isRegistering) {
                // Implement registration logic here if needed
                console.log('Registration would happen here');
                // user = await registerUser(userData);
            } else {
                user = await login(username, password);
                console.log("🔍 Utilisateur connecté :", user);

                if (user) {
                    console.log("👀 Rôle de l'utilisateur :", user.role);
                    
                    if (user.role === "TI") {
                        console.log("➡️ Redirection vers /dashboardTI");
                        navigate("/dashboardTI");
                    } else {
                        console.log("➡️ Redirection vers /dashboard");
                        navigate("/dashboard");
                    }
                }
            }
            
            setError('');
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            setError('Informations incorrectes');
        }
    };

    return (
        <div>
            <header className="login-header">
                {/* <form action="" className="login-search-bar">
                    <input required type="text" placeholder="Search..." />
                    <button type="submit" className="login-search-btn">
                        <FaSearch className="FaSearch" />
                    </button>
                </form> */}
            </header>
            <div className="background">
                <div className="login-container">
                    <div className="content">
                        <h2 className="logo">
                            <FaBuilding className="FarBuilding" />
                            CERAF Centre
                        </h2>
                        <div className="text-sci">
                            <h2>
                                Bienvenue!
                                <br />
                                <span>sur la plateforme des soldier connect</span>
                            </h2>
                            <p>Soyez plus que jamais optimal dans vos missions quotidiennes</p>
                            <div className="social-icons">
                                <a href="">
                                    <FaWhatsapp className="i FaWhatsapp" />
                                </a>
                                <a href="">
                                    <FaFacebook className="i FaFacebook" />
                                </a>
                                <a href="">
                                    <FaTwitter className="i FaTwitter" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="logred-box">
                        <div className="form-box login">
                            <form onSubmit={handleSubmit}>
                                <h2>{isRegistering ? 'Sign Up' : 'Sign In'}</h2>
                                {isRegistering && (
                                    <div className="input-box">
                                        <span className="icon">
                                            <FaEnvelope />
                                        </span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="">Email</label>
                                    </div>
                                )}
                                <div className="input-box">
                                    <span className="icon">
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="">Nom d'utilisateur</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon">
                                        <FaLock />
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="">Mot de passe</label>
                                </div>
                                <div className="remember-forgot">
                                    <input type="checkbox" />
                                    <label htmlFor="">Remember me</label>
                                    {/* <a href="">Forgot password?</a> */}
                                </div>
                                <button type="submit" className="btn">
                                    {isRegistering ? 'Sign Up' : 'Se Connecter'}
                                </button>
                                {/* <div className="login-register">
                                    <p>
                                        {isRegistering ? "Already have an account?" : "Don't have an account?"}{' '}
                                        <a href="#" onClick={() => setIsRegistering(!isRegistering)}>
                                            {isRegistering ? 'Sign In' : 'Sign Up'}
                                        </a>
                                    </p>
                                </div> */}
                            </form>
                            {error && <p className="error">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;