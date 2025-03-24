
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import React, { useState, useContext, useEffect } from "react";
import { Phone, Mail, Pencil, User as UserIcon } from 'lucide-react';
import AuthContext from "../context/AuthContext";
import { apiAccount } from "../api";
import ProfilePic from "../components/assets/user.png";
import {
  Box,
  Typography,
  Button,
  useTheme,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Avatar,
  Container
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { 
  PersonOutline as PersonOutlinedIcon,
  AlternateEmail as AlternateEmailOutlinedIcon,
  Email as EmailOutlinedIcon,
  Phone as PhoneOutlinedIcon,
  Badge as BadgeOutlinedIcon,
  Business as BusinessOutlinedIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import { tokens } from "../theme";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await apiAccount.get("/users/info/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.res) {
          setUserInfo(response.data.res);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des informations utilisateur:", error);
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [token]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="h6" mt={3}>
          Chargement de votre profil...
        </Typography>
      </Box>
    );
  }

  const profileSections = [
    {
      label: "Informations personnelles",
      items: [
        {
          label: "Nom d'utilisateur",
          value: userInfo?.username,
          icon: <PersonOutlinedIcon  size={20} />
        },
        {
          label: "Nom",
          value: userInfo?.nom,
          icon: <BadgeOutlinedIcon  size={20} />
        },
        {
          label: "Prénom",
          value: userInfo?.prenom,
          icon: <BadgeOutlinedIcon  size={20} />
        }
      ]
    },
    {
      label: "Contact",
      items: [
        {
          label: "Email",
          value: userInfo?.email,
          icon: <EmailOutlinedIcon  size={20} />
        },
        {
          label: "Téléphone",
          value: userInfo?.telephone,
          icon: <PhoneOutlinedIcon size={20} />
        }
      ]
    }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ position: 'relative', py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            backgroundColor: isDarkMode ? colors.primary[400] : '#fff',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Banner et Photo de profil */}
          <Box
            sx={{
              height: 200,
              backgroundColor: colors.blueAccent[700],
              position: 'relative',
            }}
          >
            <Avatar
              src={ProfilePic}
              sx={{
                width: 150,
                height: 150,
                border: `4px solid ${isDarkMode ? colors.primary[400] : '#fff'}`,
                position: 'absolute',
                bottom: -75,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </Box>

{/* Contenu du profil */}
<Box sx={{ mt: 10, p: 4 }}>
  <Typography
    variant="h4"
    textAlign="center"
    gutterBottom
    sx={{ color: isDarkMode ? colors.grey[100] : colors.grey[900] }}
  >
    {userInfo?.prenom} {userInfo?.nom}
  </Typography>

  <Typography
    variant="subtitle1"
    textAlign="center"
    sx={{ 
      color: isDarkMode ? colors.grey[300] : colors.grey[600],
      mb: 4 
    }}
  >
    @{userInfo?.username}
  </Typography>

  <Grid container spacing={4}>
    {profileSections.map((section, sectionIndex) => (
      <Grid item xs={12} key={sectionIndex}>
        <Paper
          sx={{
            backgroundColor: isDarkMode ? colors.primary[500] : colors.grey[100],
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.blueAccent[isDarkMode ? 400 : 700],
              mb: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {section.label}
          </Typography>
          <Divider sx={{ 
            mb: 2, 
            backgroundColor: isDarkMode ? colors.grey[800] : colors.grey[300]
          }} />
          
          {section.items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                '&:last-child': { mb: 0 },
              }}
            >
              <Box
                sx={{
                  mr: 2,
                  color: colors.blueAccent[isDarkMode ? 400 : 700],
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: isDarkMode ? colors.grey[300] : colors.grey[600]
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    color: isDarkMode ? colors.grey[100] : colors.grey[900]
                  }}
                >
                  {item.value || '-'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Grid>
    ))}
  </Grid>

  <Box sx={{ mt: 4, textAlign: 'center' }}>
    <Button
      variant="contained"
      startIcon={<EditIcon />}
      sx={{
        backgroundColor: colors.blueAccent[700],
        color: '#fff',
        '&:hover': {
          backgroundColor: colors.blueAccent[600],
        },
      }}
    >
      Modifier le profil
    </Button>
  </Box>
</Box>

        </Paper>
      </Box>
    </Container>
  );
};

export default UserProfile;