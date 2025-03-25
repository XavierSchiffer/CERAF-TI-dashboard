import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { 
  ArrowBackIosNew as BackIcon, 
  PrintOutlined as PrintIcon 
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { apiAccount } from '../../api';
import Header from "../../components/Header";

const InterventionDetailsA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [intervention, setIntervention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterventionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiAccount.get(`interventions/detailsA/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Données du backend :", response.data);
  
        // Correction ici :
        const interventionData = response.data?.results?.[0];
  
        if (interventionData) {
          setIntervention(interventionData);
        } else {
          setError("Détails de l'intervention non trouvés");
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des détails de l'intervention :", error);
        setError("Impossible de charger les détails de l'intervention");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterventionDetails();
  }, [id]);
  

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderDetailSection = (title, children) => (
    <Paper 
      elevation={3} 
      sx={{ 
        backgroundColor: colors.primary[400], 
        p: 2, 
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

  const renderDetailRow = (label, value) => (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={4}>
        <Typography variant="body2" fontWeight="bold" color={colors.grey[100]}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" color={colors.grey[200]}>
          {value || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box m="20px">
        <Typography>Chargement des détails de l'intervention...</Typography>
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
        mb={2}
      >
        <Header 
          title="DÉTAILS DE L'INTERVENTION" 
          subtitle={`Intervention de ${intervention.technicien_username}`} 
        />
        <Box display="flex" gap={1}>
          <Tooltip title="Retour">
            <IconButton onClick={handleGoBack} color="primary">
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimer">
            <IconButton onClick={handlePrint} color="primary">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderDetailSection("Informations Générales", (
            <>
              {renderDetailRow("Date", intervention.date)}
              {renderDetailRow("Région", intervention.region)}
              {renderDetailRow("Ville", intervention.ville)}
              {renderDetailRow("CERAF", intervention.ceraf)}
              {renderDetailRow("Techniciens", intervention.technicien_username)}
              {renderDetailRow("FAT", intervention.fat)}
              {renderDetailRow("Quartier", intervention.quartier)}
              {renderDetailRow("Localisation", intervention.localisation)}
              {renderDetailRow("Type d'Appui", intervention.type_appui)}
              {renderDetailRow("État de l'Appui", intervention.etat_appui)}
              {renderDetailRow("Étiquetage Externe", intervention.etiquetage_externe)}
              {renderDetailRow("État", intervention.etat)}
            </>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          {renderDetailSection("Informations Géographiques", (
            <>
              {renderDetailRow("Longitude", intervention.longitude)}
              {renderDetailRow("Latitude", intervention.latitude)}
              {renderDetailRow("Central", intervention.central)}
              {renderDetailRow("FDT", intervention.fdt)}
            </>
          ))}

          {renderDetailSection("Informations sur les Splitters", (
            <>
              {renderDetailRow("Nombre de Splitters", intervention.nombre_splitter)}
              
              {intervention.nombre_splitter >= 1 && renderDetailSection("Splitter 1", (
                <>
                  {renderDetailRow("Ports Physiques", intervention.ports_physiques_spl1)}
                  {renderDetailRow("Puissance Entrée", intervention.puissance_entree_spl1)}
                  {renderDetailRow("Puissance Sortie", intervention.puissance_sortie_spl1)}
                  {renderDetailRow("FSP", intervention.fsp_spl1)}
                  {renderDetailRow("OLT", intervention.olt_spl1)}
                  {renderDetailRow("Ports Actifs", intervention.ports_actifs_spl1)}
                </>
              ))}

              {intervention.nombre_splitter === 2 && renderDetailSection("Splitter 2", (
                <>
                  {renderDetailRow("Ports Physiques", intervention.ports_physiques_spl2)}
                  {renderDetailRow("Puissance Entrée", intervention.puissance_entree_spl2)}
                  {renderDetailRow("Puissance Sortie", intervention.puissance_sortie_spl2)}
                  {renderDetailRow("FSP", intervention.fsp_spl2)}
                  {renderDetailRow("OLT", intervention.olt_spl2)}
                  {renderDetailRow("Ports Actifs", intervention.ports_actifs_spl2)}
                </>
              ))}
            </>
          ))}

          {renderDetailSection("Remarques", (
            <Typography variant="body2" color={colors.grey[200]}>
              {intervention.remarque || 'Aucune remarque'}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterventionDetailsA;