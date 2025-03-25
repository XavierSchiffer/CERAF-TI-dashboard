import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowLeft, Loader } from 'lucide-react';
import AuthContext from "../../context/AuthContext";
import { apiIntervention, apiAccount } from "../../api";
import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme";

const EditIntervention = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { id } = useParams();


  const [formData, setFormData] = useState({
    region: '',
    ville: '',
    ceraf: '',
    fat: '',
    quartier: '',
    localisation: '',
    longitude: '',
    latitude: '',
    type_appui: '',
    etat_appui: '',
    etiquetage_externe: '',
    etat: '',

    nombre_splitter: 0,
    
    ports_physiques_spl1: '',
    puissance_entree_spl1: '',
    puissance_sortie_spl1: '',
    fsp_spl1: '',
    olt_spl1: '',
    ports_actifs_spl1: '',

    ports_physiques_spl2: '',
    puissance_entree_spl2: '',
    puissance_sortie_spl2: '',
    fsp_spl2: '',
    olt_spl2: '',
    ports_actifs_spl2: '',

    fdt: '',
    central: '',
    remarque: ''
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
      const response = await apiAccount.get(`interventions/detailsA/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("######## Donne de la reponse", response.data)
      if (response.data.etat === "SUCCES") {
        setFormData(response.data.results[0]);
      } else {
        setError(response.data.msg || "Erreur lors de la récupération des informations de l'intervention");
      }
    } catch (error) {
      setError("Erreur lors de la récupération des informations de l'intervention");
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
      const response = await apiAccount.put(`/sadmin/interventions/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("##### Réponse API:", response.data); // Debugging
  
      const responseData = response.data;
  
      // Vérification du message de succès
      if (responseData.message === "Intervention mise à jour avec succès") {
        setSuccess(responseData.message); // Affiche le message de succès
        setTimeout(() => navigate("/intervention-listA"), 2000); // Redirige après 2 secondes
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
        <Typography>Chargement de l'intervention...</Typography>
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

        <Typography variant="h2">Modifier l'intervention</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="grid" gap="15px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
          {/* Informations de base */}
          <TextField
            fullWidth
            variant="filled"
            label="Région"
            name="region"
            value={formData.region}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            variant="filled"
            label="CERAF"
            name="ceraf"
            value={formData.ceraf}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="FAT"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />

          {/* Localisation */}
          <TextField
            fullWidth
            variant="filled"
            label="Quartier"
            name="quartier"
            value={formData.quartier}
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
            label="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="Latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            disabled={loading}
            type="text"
            sx={{ gridColumn: "span 2" }}
          />

          {/* État et type */}
          <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
            <InputLabel>Type d'appui</InputLabel>
            <Select
              name="type_appui"
              value={formData.type_appui}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="Bois">Bois</MenuItem>
              <MenuItem value="Béton">Béton</MenuItem>
              <MenuItem value="Métallique">Métallique</MenuItem>
              <MenuItem value="Façade">Façade</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
            <InputLabel>État de l'appui</InputLabel>
            <Select
              name="etat_appui"
              value={formData.etat_appui}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="Bon">Bon</MenuItem>
              <MenuItem value="Moyen">Moyen</MenuItem>
              <MenuItem value="Mauvais">Mauvais</MenuItem>
            </Select>
          </FormControl>

          {/* Splitters */}
          <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
            <InputLabel>Nombre de splitters</InputLabel>
            <Select
              name="nombre_splitter"
              value={formData.nombre_splitter}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>
          </FormControl>

          {/* Splitter 1 */}
          {formData.nombre_splitter >= 1 && (
            <>
              <TextField
                fullWidth
                variant="filled"
                label="Ports physiques Splitter 1"
                name="ports_physiques_spl1"
                value={formData.ports_physiques_spl1}
                onChange={handleChange}
                disabled={loading}
                type="number"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Puissance entrée Splitter 1"
                name="puissance_entree_spl1"
                value={formData.puissance_entree_spl1}
                onChange={handleChange}
                disabled={loading}
                type="number"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Puissance sortie Splitter 1"
                name="puissance_sortie_spl1"
                value={formData.puissance_sortie_spl1}
                onChange={handleChange}
                disabled={loading}
                type="number"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="FSP Splitter 1"
                name="fsp_spl1"
                value={formData.fsp_spl1}
                onChange={handleChange}
                disabled={loading}
                sx={{ gridColumn: "span 2" }}
              />
            </>
          )}

          {/* Splitter 2 */}
          {formData.nombre_splitter === 2 && (
            <>
              <TextField
                fullWidth
                variant="filled"
                label="Ports physiques Splitter 2"
                name="ports_physiques_spl2"
                value={formData.ports_physiques_spl2}
                onChange={handleChange}
                disabled={loading}
                type="number"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Puissance entrée Splitter 2"
                name="puissance_entree_spl2"
                value={formData.puissance_entree_spl2}
                onChange={handleChange}
                disabled={loading}
                type="number"
                sx={{ gridColumn: "span 2" }}
              />
            </>
          )}

          {/* Autres informations */}
          <TextField
            fullWidth
            variant="filled"
            label="Central"
            name="central"
            value={formData.central}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            label="FDT"
            name="fdt"
            value={formData.fdt}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="filled"
            label="Remarques"
            name="remarque"
            value={formData.remarque}
            onChange={handleChange}
            disabled={loading}
            sx={{ gridColumn: "span 4" }}
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

export default EditIntervention;