import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, Button, useTheme, Divider  } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AuthContext from "../../context/AuthContext";
// import { apiFruit } from "../../api";
import { useContext } from "react";



const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SidebarU = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  TI SYSTEME
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {/* Ed Roh */}
                  {user.username}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Users
                </Typography>
              </Box>
            </Box>
          )}

          {/* LOGO AND MENU ICON */}
          {/* ... [Section logo reste identique] ... */}

          {/* PROFILE SECTION */}
          {!isCollapsed && (
            <Box mb="25px">
              {/* ... [Section profil reste identique] ... */}
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboardTI"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* DATA SECTION */}
            {!isCollapsed && (
              <Box mt="20px">
                <Divider sx={{ 
                  m: "15px 0",
                  borderColor: colors.grey[800],
                  opacity: 0.5
                }} />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ 
                    m: "15px 0 5px 20px",
                    fontWeight: "bold"
                  }}
                >
                  Data
                </Typography>
              </Box>
            )}
            <Item
              title="Consulté Propositions"
              to="/proposition-list"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Liste Interventions"
              to="/proposition-list"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Consulte statistiques"
              to="/statistiques"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Consulte rapports"
              to="/statistiques"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* PAGES SECTION */}
            {!isCollapsed && (
              <Box mt="20px">
                <Divider sx={{ 
                  m: "15px 0",
                  borderColor: colors.grey[800],
                  opacity: 0.5
                }} />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ 
                    m: "15px 0 5px 20px",
                    fontWeight: "bold"
                  }}
                >
                  Pages
                </Typography>
              </Box>
            )}
            <Item
              title="Faire rapport"
              to="/rapport"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* CHARTS SECTION */}
            {!isCollapsed && (
              <Box mt="20px">
                <Divider sx={{ 
                  m: "15px 0",
                  borderColor: colors.grey[800],
                  opacity: 0.5
                }} />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ 
                    m: "15px 0 5px 20px",
                    fontWeight: "bold"
                  }}
                >
                  Charts
                </Typography>
              </Box>
            )}
            <Item
              title="Bar Chart"
              to="/barU"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pieU"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/lineU"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          {/* LOGOUT SECTION */}
          {!isCollapsed && (
            <Box mt="20px">
              <Divider sx={{ 
                m: "15px 0",
                borderColor: colors.grey[800],
                opacity: 0.5
              }} />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ 
                  m: "15px 0 5px 20px",
                  fontWeight: "bold"
                }}
              >
                Logout
              </Typography>
            </Box>
          )}

          {/* Bouton de Déconnexion */}
          <Box 
            p={isCollapsed ? "10px" : "20px"}
            mt="auto"
            sx={{
              borderTop: `1px solid ${colors.grey[800]}`,
              background: `linear-gradient(to bottom, ${colors.primary[400]}, ${colors.primary[500]})`,
            }}
          >
            <Box
              onClick={() => {
                logout();
                navigate("/login");
              }}
              sx={{
                backgroundColor: colors.blueAccent[700],
                borderRadius: "8px",
                transition: "all 0.3s ease",
                padding: isCollapsed ? "8px" : "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                '&:hover': {
                  backgroundColor: colors.blueAccent[600],
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
                },
              }}
            >
              <ExitToAppIcon 
                sx={{
                  color: colors.greenAccent[500],
                  fontSize: isCollapsed ? "28px" : "24px",
                  filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))",
                }}
              />
              {!isCollapsed && (
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ ml: "10px" }}
                >
                  Déconnexion
                </Typography>
              )}
            </Box>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SidebarU;