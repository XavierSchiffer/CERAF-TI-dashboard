import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import {
  LightModeOutlined as LightModeIcon,
  DarkModeOutlined as DarkModeIcon,
  NotificationsOutlined as NotificationsIcon,
  SettingsOutlined as SettingsIcon,
  PersonOutlined as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { X } from "lucide-react";
import { ColorModeContext, tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { apiDemande } from "../../api";
import SettingsPopupTI from "../SettingsPopupTI";
import "./Topbar.css";

const TopbarTI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // État des notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  // État des paramètres
  const [showSettings, setShowSettings] = useState(false);

  // Récupérer les notifications non lues
  const fetchNotifications = async () => {
    try {
      const response = await apiDemande.get("notifications/non_lues/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.alertes);
      setUnreadCount(response.data.alertes.length);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
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

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      await apiDemande.put(`notifications/lues/${notificationId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, statut_lecture: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      fetchNotifications();
    } catch (error) {
      console.error("Erreur lors du marquage comme lu :", error);
    }
  };

  const handleUserClick = () => navigate("/profil");

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Barre de recherche */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Icônes */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* Notifications */}
        <div className="notifications-container">
          <IconButton onClick={() => setShowNotifications(!showNotifications)}>
            <NotificationsIcon />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </IconButton>
          {showNotifications && (
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
                      className={`notification-item ${notification.statut_lecture ? "read" : "unread"}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-title"  style={{ color: "black" }}>{notification.message}</div>
                      <div className="notification-date">{notification.date_envoi}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">Aucune notification</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Paramètres */}
        <div className="settings-container">
          <IconButton onClick={() => setShowSettings(!showSettings)}>
            <SettingsIcon />
          </IconButton>
          {showSettings && <SettingsPopupTI isOpen={showSettings} onClose={() => setShowSettings(false)} />}
        </div>

        {/* Profil utilisateur */}
        <IconButton onClick={handleUserClick} className={location.pathname === "/profile" ? "active" : ""}>
          <PersonIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopbarTI;