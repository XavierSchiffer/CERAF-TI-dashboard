import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding } from 'react-icons/fa';
import './Loader.css';

const Loader = () => {
  const colorVariants = {
    initial: { backgroundColor: '#007bff', scale: 1 },
    animate: { 
      backgroundColor: [
        '#007bff',   // Bleu initial
        '#28a745',   // Vert
        '#dc3545',   // Rouge
        '#ffc107',   // Jaune
        '#007bff'    // Retour au bleu
      ],
      scale: [1, 1.1, 0.9, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="loader-container">
      <motion.div 
        className="loader-logo-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 120 
        }}
      >
        <img 
          src="/assets/logo-Camtel.png" 
          alt="CERAF Centre Logo" 
          className="loader-logo"
        />
      </motion.div>

      <motion.div 
        className="loader-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1, 
          type: "spring", 
          stiffness: 120 
        }}
      >
        <motion.div 
          className="loader-icon"
          animate={{
            rotate: [0, 360],
            color: [
              '#007bff',   // Bleu
              '#28a745',   // Vert
              '#dc3545',   // Rouge
              '#ffc107',   // Jaune
              '#007bff'    // Retour au bleu
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaBuilding />
        </motion.div>
        
        <motion.div 
          className="color-overlay"
          variants={colorVariants}
          initial="initial"
          animate="animate"
        />
        
        <motion.h2 
          className="loader-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            color: [
              '#007bff',   // Bleu
              '#28a745',   // Vert
              '#dc3545',   // Rouge
              '#ffc107',   // Jaune
              '#007bff'    // Retour au bleu
            ]
          }}
          transition={{ 
            delay: 0.5, 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          CERAF Centre
        </motion.h2>
        
        <motion.div 
          className="loader-spinner"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            borderColor: [
              '#007bff',   // Bleu
              '#28a745',   // Vert
              '#dc3545',   // Rouge
              '#ffc107',   // Jaune
              '#007bff'    // Retour au bleu
            ]
          }}
          transition={{ 
            delay: 0.7,
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="spinner"></div>
        </motion.div>
        
        <motion.p
          className="loader-text"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            color: [
              '#007bff',   // Bleu
              '#28a745',   // Vert
              '#dc3545',   // Rouge
              '#ffc107',   // Jaune
              '#007bff'    // Retour au bleu
            ]
          }}
          transition={{ 
            delay: 1,
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Chargement en cours...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;