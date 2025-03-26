import React, { useState, useContext } from "react";
import { motion } from "framer-motion";  // ✅ Import de Framer Motion
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Loader from "./Loader";
import "./Login.css";

function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(false);
        setError("");

        try {
            if (isRegistering) {
                console.log("Registration would happen here");
            } else {
                const user = await login(username, password);
                console.log("🔍 Utilisateur connecté :", user);

                if (user) {
                    console.log("👀 Rôle de l'utilisateur :", user.role);
                    setIsLoading(true);
                    
                    setTimeout(() => {
                        if (user.role === "TI") {
                            navigate("/dashboardTI");
                        } else {
                            navigate("/dashboard");
                        }
                    }, 3000);
                } else {
                    setError("Nom d'utilisateur ou mot de passe incorrect ❌");
                }
            }
        } catch (err) {
            console.error("Erreur lors de la soumission:", err);
            setError("Nom d'utilisateur ou mot de passe incorrect ❌");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <header className="login-header"></header>
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
                                <a href="#"><FaWhatsapp className="i FaWhatsapp" /></a>
                                <a href="#"><FaFacebook className="i FaFacebook" /></a>
                                <a href="#"><FaTwitter className="i FaTwitter" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="logred-box">
                        <div className="form-box login">
                            <form onSubmit={handleSubmit}>
                                <h2>{isRegistering ? "Sign Up" : "Sign In"}</h2>
                                {isRegistering && (
                                    <div className="input-box">
                                        <span className="icon"><FaEnvelope /></span>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        <label>Email</label>
                                    </div>
                                )}
                                <div className="input-box">
                                    <span className="icon"><FaUser /></span>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    <label>Nom d'utilisateur</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"><FaLock /></span>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <label>Mot de passe</label>
                                </div>
                                <div className="remember-forgot">
                                    <input type="checkbox" />
                                    <label>Remember me</label>
                                </div>
                                <button type="submit" className="btn">{isRegistering ? "Sign Up" : "Se Connecter"}</button>
                            </form>

                            {/* ✅ Animation du message d'erreur */}
                            {error && (
                                <motion.p 
                                    className="error"
                                    initial={{ opacity: 0, y: -10 }}  // Départ invisible, légèrement vers le haut
                                    animate={{ opacity: 1, y: 0 }}    // Apparition en douceur
                                    exit={{ opacity: 0, y: -10 }}     // Disparition vers le haut
                                    transition={{ duration: 0.5 }}    // Durée de l'animation
                                >
                                    {error}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
