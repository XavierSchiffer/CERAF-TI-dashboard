import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorDialog.css';


const ErrorDialog = ({ message, onClose }) => {
  return (
    <motion.div 
      className="error-dialog-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="error-dialog-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="error-dialog-header">
          <FaExclamationTriangle className="error-icon" />
          <h2>Erreur de Connexion</h2>
        </div>
        <div className="error-dialog-content">
          <p>{message}</p>
        </div>
        <div className="error-dialog-actions">
          <button onClick={onClose} className="error-dialog-btn">
            Réessayer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ErrorDialog;