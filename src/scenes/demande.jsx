import React from 'react';
import { Link } from 'react-router-dom';
import { UserCog, Lock } from 'lucide-react';
import "./SettingsPopup.css";

const Demande = () => {

  return (
    <div className="settings-popup">
      <div className="settings-menu">
        <Link to="/edit-profileU" className="settings-item" onClick={onClose}>
          <UserCog size={20} />
          <span>Modifier le profil</span>
        </Link>
        <Link to="/edit-passwordU" className="settings-item" onClick={onClose}>
          <Lock size={20} />
          <span>Changer le mot de passe</span>
        </Link>
      </div>
    </div>
  );
};

export default Demande;