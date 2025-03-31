import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowLeft, Loader } from 'lucide-react';
import AuthContext from "../../context/AuthContext";
import { apiIntervention, apiAccount } from "../../api";
import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme";

const EditAbonne = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { id } = useParams();


  const [formData, setFormData] = useState({
    username: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    localisation: '',
    statut_social: '',
    OLT: '',
    FDT: '',
    FSP: '',
    FAT: '',
    num_port_fat: '',
    spliteur: '',

  });

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchInterventionInfo();
  }, []);

  const fetchInterventionInfo = async () => {
    try {
      // Récupérer l'ID de l'intervention depuis l'URL ou le contexte
    //   const interventionId = new URLSearchParams(window.location.search).get('id');
      console.log("######## Id ", id)
      const response = await apiAccount.get(`abonnes/details/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("######## Donne de la reponse", response.data)
      if (response.data.etat === "SUCCES") {
        setFormData(response.data.results[0]);
      } else {
        setError(response.data.msg || "Erreur lors de la récupération des informations de l'abonné.");
      }
    } catch (error) {
      setError("Erreur lors de la récupération des informations de l'abonné.");
      console.error("❌ Erreur lors de la récupération des informations:", error);
    } finally {
      setInitialLoad(false);
    }
    console.log("Données mises dans formData:", formData);

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await apiAccount.put(`/sadmin/update/abonne/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("##### Réponse API:", response.data); // Debugging
  
      const responseData = response.data;
  
      // Vérification du message de succès
      if (responseData.message === "Profil mis à jour avec succès") {
        setSuccess(responseData.message); // Affiche le message de succès
        setTimeout(() => navigate("/dashboard"), 2000); // Redirige après 2 secondes
      } else {
        setError(responseData.message || "Réponse inattendue de l'API");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error);
  
      if (error.response) {
        console.log("Réponse du serveur:", error.response.data);
        setError(error.response.data.message || "Erreur côté serveur");
      } else if (error.request) {
        setError("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        setError("Erreur lors de la requête.");
      }
    }
  
    setLoading(false);
  };
  
  

  if (initialLoad) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Loader className="animate-spin" size={40} />
        <Typography>Chargement des détails de l'abonné...</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Tooltip title="Retour à la liste des interventions">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              borderRadius: 2,
              '&:hover': { backgroundColor: colors.blueAccent[600] }
            }}
          >
            <ArrowLeft />
          </IconButton>
        </Tooltip>

        <Typography variant="h2">Modifier l'abonné</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="grid" gap="15px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
          {/* Informations de base */}
          <TextField
            fullWidth
            variant="filled"
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            label="Prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />

          {/* Localisation */}
          <TextField
            fullWidth
            variant="filled"
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Localisation"
            name="localisation"
            value={formData.localisation}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Statut Social"
            name="statut_social"
            value={formData.statut_social}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="OLT"
            name="OLT"
            value={formData.OLT}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="FDT"
            name="FDT"
            value={formData.FDT}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="FSP"
            name="FSP"
            value={formData.FSP}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="FAT"
            name="FAT"
            value={formData.FAT}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Numéro de port fat"
            name="num_port_fat"
            value={formData.num_port_fat}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Spliteur"
            name="spliteur"
            value={formData.spliteur}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}

        <Box display="flex" justifyContent="end" mt="20px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <Loader size={20} className="animate-spin" />
                <span>Mise à jour en cours...</span>
              </Box>
            ) : (
              'Mettre à jour l\'intervention'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditAbonne;