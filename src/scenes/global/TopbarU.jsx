import { Link, useNavigate } from "react-router-dom";

import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AuthContext from "../../context/AuthContext";
import { useState, useContext, useRef, useEffect } from "react";
import { apiDemande } from "../../api";
import { Moon, Sun, Bell, User, Settings, Home, LogOut, X } from "lucide-react";
import "./Topbar.css";
import { useLocation } from 'react-router-dom';
import SettingsPopupU from "../SettingsPopupU";



const TopbarU = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  const { token } = useContext(AuthContext);
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await apiDemande.get("/alertes/non_lues/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.alertes);
      setUnreadCount(response.data.alertes.length);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des notifications :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // Actualiser les notifications toutes les 5 minutes
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiDemande.put(`/alertes/read/${notificationId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      fetchNotifications();
    } catch (error) {
      console.error("❌ Erreur lors du marquage comme lu :", error);
    }
  };

  const NotificationsPopup = () => (
    <div ref={notificationRef} className="notifications-popup">
      <div className="notifications-header">
        <h3 style={{ color: "black" }}>Notifications ({unreadCount})</h3>
        <button onClick={() => setShowNotifications(false)}>
          <X size={20} />
        </button>
      </div>
      <div className="notifications-content">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? "read" : "unread"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-date">{notification.date_envoi}</div>
            </div>
          ))
        ) : (
          <div className="no-notifications">Aucune notification</div>
        )}
      </div>
    </div>
  );
  const navigate = useNavigate();


  const handleUserClick = async () => {
    navigate('/profil')
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <div className="notifications-container">
          <IconButton onClick={() => setShowNotifications(!showNotifications)} 
              className="user-button">
              <NotificationsOutlinedIcon />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
          </IconButton>
        {showNotifications && <NotificationsPopup />}
        </div>
        <div className="settings-container">
          <IconButton 
            className={`icon-button ${showSettings ? "active" : ""}`} 
            onClick={() => setShowSettings(!showSettings)}
          >
            <SettingsOutlinedIcon className="topbar-icon" />
          </IconButton>

          {showSettings && (
            <>
              <div className="settings-overlay" onClick={() => setShowSettings(false)} />
              <SettingsPopupU isOpen={showSettings} onClose={() => setShowSettings(false)} />
            </>
          )}
        </div>
        <IconButton             
          className={`user-button ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={handleUserClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopbarU;