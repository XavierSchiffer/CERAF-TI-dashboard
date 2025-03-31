import React from "react";
import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorMessage = ({ message }) => {
    return (
        <motion.div 
            className="error-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
                duration: 0.4, 
                type: "spring", 
                stiffness: 120 
            }}
        >
            <div className="error-content">
                <FaExclamationCircle className="error-icon" />
                <p className="error-text">{message}</p>
            </div>
        </motion.div>
    );
};

export default ErrorMessage;