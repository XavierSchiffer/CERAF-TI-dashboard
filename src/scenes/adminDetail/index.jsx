import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { 
  ArrowBackIosNew as BackIcon, 
  PersonOutline as ProfileIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  CalendarTodayOutlined as CalendarIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { apiAccount } from '../../api';
import Header from "../../components/Header";

const AdminDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiAccount.get(`admins/details/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("################## Données du backend :", response.data);
  
        // Correction ici :
        // const interventionData = response.data?.results?.[0];
        const technicianData = response.data?.results?.[0];
        
        if (technicianData) {
          setTechnician(technicianData);
        } else {
          setError("Détails du technicien non trouvés");
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des détails du technicien :", error);
        setError("Impossible de charger les détails du technicien");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderDetailSection = (title, children) => (
    <Paper 
      elevation={3} 
      sx={{ 
        backgroundColor: colors.primary[400], 
        p: 3, 
        mb: 2, 
        borderRadius: 2 
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          color: colors.greenAccent[400], 
          mb: 2, 
          borderBottom: `2px solid ${colors.greenAccent[400]}`,
          pb: 1 
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );

  const renderDetailRow = (icon, label, value) => (
    <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
      <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        {icon}
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="body1" color={colors.grey[200]}>
          {value || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box m="20px">
        <Typography>Chargement des détails de l'administrateur...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Header 
          title="DÉTAILS DE L'ADMINISTRATEUR" 
          subtitle={`Profil de ${technician.username}`} 
        />
        <Tooltip title="Retour">
          <IconButton onClick={handleGoBack} color="primary">
            <BackIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              backgroundColor: colors.primary[400], 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              borderRadius: 2
            }}
          >
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2, 
                bgcolor: colors.greenAccent[600] 
              }}
            >
              {technician.prenom ? technician.prenom[0].toUpperCase() : 
               technician.username[0].toUpperCase()}
            </Avatar>
            <Typography 
              variant="h4" 
              color={colors.grey[100]} 
              sx={{ mb: 1 }}
            >
              {`${technician.prenom || ''} ${technician.nom || ''}`}
            </Typography>
            <Typography 
              variant="subtitle1" 
              color={colors.greenAccent[400]}
            >
              {technician.role}
            </Typography>
          </Paper>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12} md={8}>
          {renderDetailSection("Informations Personnelles", (
            <>
              {renderDetailRow(
                <ProfileIcon color="primary" />, 
                "Nom d'utilisateur", 
                technician.username
              )}
              {renderDetailRow(
                <ProfileIcon color="primary" />, 
                "Nom", 
                technician.nom
              )}
              {renderDetailRow(
                <ProfileIcon color="primary" />, 
                "Prénom", 
                technician.prenom
              )}
              {renderDetailRow(
                <EmailIcon color="primary" />, 
                "Email", 
                technician.email
              )}
              {renderDetailRow(
                <PhoneIcon color="primary" />, 
                "Téléphone", 
                technician.telephone
              )}
              {renderDetailRow(
                <CalendarIcon color="primary" />, 
                "Date de Création", 
                new Date(technician.created_at).toLocaleDateString()
              )}
            </>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDetails;