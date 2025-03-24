import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Box, 
  Button, 
  TextField, 
  useTheme, 
  IconButton, 
  Tooltip,
  Typography,
  Grid,
  MenuItem,
  Divider
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Loader, ArrowLeft as BackIcon } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { apiIntervention, apiDemande } from "../../api";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const InterventionPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
//   const { id } = useParams(); // Récupère l'ID de la proposition depuis l'URL
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [idDemande, setIdDemande] = useState(null);
  const [propositions, setPropositions] = useState([]);
  const [interventionData, setInterventionData] = useState(null);

  
  useEffect(() => {
    const fetchPropositions = async () => {
      try {
        const response = await apiDemande.get("offre/propositions/TI/", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data && Array.isArray(response.data[0]?.results)) {
          const propositionsData = response.data[0].results.flat(); // Aplatir le tableau
  
          if (propositionsData.length > 0) {
            const sortedPropositions = propositionsData.sort(
              (a, b) => new Date(b.date_envoie) - new Date(a.date_envoie)
            );
  
            setPropositions(sortedPropositions);
  
            // Récupérer l'idDemande de la première proposition (ajustez selon votre logique)
            setIdDemande(sortedPropositions[0]?.idDemande || null);
          }
        } else {
          console.error("❌ Format de réponse inattendu");
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des propositions :", error);
      }
      setLoading(false);
    };
  
    fetchPropositions();
  }, [token]);
  
  const handleFormSubmit = async (values) => {
    if (!idDemande) {
      setError("ID de la demande non trouvé");
      return;
    }
    console.log("ID de la demande avant l'envoi:", idDemande);  // Vérifiez l'ID ici
    setLoading(true);
    try {
      const response = await apiIntervention.post(`/send/${idDemande}/`, {
        date: values.date,
        region: values.region,
        ville: values.ville,
        ceraf: values.ceraf,
        fat: values.fat,
        quartier: values.quartier,
        localisation: values.localisation,
        longitude: values.longitude,
        latitude: values.latitude,
        type_appui: values.type_appui,
        etat_appui: values.etat_appui,
        etiquetage_externe: values.etiquetage_externe,
        etat: values.etat,
        nombre_splitter: values.nombre_splitter,
  
        // Splitter 1
        ports_physiques_spl1: values.ports_physiques_spl1,
        puissance_entree_spl1: values.puissance_entree_spl1,
        puissance_sortie_spl1: values.puissance_sortie_spl1,
        fsp_spl1: values.fsp_spl1,
        olt_spl1: values.olt_spl1,
        ports_actifs_spl1: values.ports_actifs_spl1,
  
        // Splitter 2
        ports_physiques_spl2: values.ports_physiques_spl2,
        puissance_entree_spl2: values.puissance_entree_spl2,
        puissance_sortie_spl2: values.puissance_sortie_spl2,
        fsp_spl2: values.fsp_spl2,
        olt_spl2: values.olt_spl2,
        ports_actifs_spl2: values.ports_actifs_spl2,
  
        fdt: values.fdt,
        central: values.central,
        remarque: values.remarque
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Adaptez la réponse ici si nécessaire
      if (response.data && response.data.etat === "SUCCES") {
        const formattedData = {
          ...response.data.data,  // Extraire les données
          idDemande: response.data.data.idDemande,
          technicien: response.data.data.technicien
        };
  
        // Sauvegarder les données dans l'état
        setInterventionData(formattedData);
  
        setSuccess("Intervention enregistrée avec succès");
        setTimeout(() => navigate("/dashboardTI"), 2000);
      } else {
        setError(response.data.message || "Erreur lors de l'enregistrement de l'intervention");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de l'enregistrement de l'intervention");
      console.error("❌ Erreur lors de l'envoi de l'intervention :", error);
      console.error("❌ Erreur lors de l'envoi de l'intervention :", error.response?.data || error.message);
    }
    setLoading(false);
  };
  

  return (
    <Box m="20px">
      {/* En-tête avec bouton retour */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={2}
      >
        <Tooltip title="Retour à la liste des propositions">
          <IconButton 
            onClick={() => navigate("/propositions")}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              borderRadius: 2,
              '&:hover': {
                backgroundColor: colors.blueAccent[600],
              }
            }}
          >
            <BackIcon />
          </IconButton>
        </Tooltip>
        
        <Header 
          title="INTERVENTION" 
          subtitle="Formulaire de rapport d'intervention" 
        />
      </Box>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={interventionSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography variant="h4" color={colors.greenAccent[400]}>
                Informations générales
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="FAT"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fat}
                    name="fat"
                    error={!!touched.fat && !!errors.fat}
                    helperText={touched.fat && errors.fat}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Quartier"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quartier}
                    name="quartier"
                    error={!!touched.quartier && !!errors.quartier}
                    helperText={touched.quartier && errors.quartier}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Localisation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.localisation}
                    name="localisation"
                    error={!!touched.localisation && !!errors.localisation}
                    helperText={touched.localisation && errors.localisation}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Longitude (optionnel)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.longitude}
                    name="longitude"
                    error={!!touched.longitude && !!errors.longitude}
                    helperText={touched.longitude && errors.longitude}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Latitude (optionnel)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.latitude}
                    name="latitude"
                    error={!!touched.latitude && !!errors.latitude}
                    helperText={touched.latitude && errors.latitude}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mb={3}>
              <Typography variant="h4" color={colors.greenAccent[400]}>
                État et caractéristiques
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    variant="filled"
                    label="Type d'appui"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.type_appui}
                    name="type_appui"
                    error={!!touched.type_appui && !!errors.type_appui}
                    helperText={touched.type_appui && errors.type_appui}
                  >
                    <MenuItem value="Bois">Bois</MenuItem>
                    <MenuItem value="Béton">Béton</MenuItem>
                    <MenuItem value="Métallique">Métallique</MenuItem>
                    <MenuItem value="Façade">Façade</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    variant="filled"
                    label="État de l'appui"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.etat_appui}
                    name="etat_appui"
                    error={!!touched.etat_appui && !!errors.etat_appui}
                    helperText={touched.etat_appui && errors.etat_appui}
                  >
                    <MenuItem value="Bon">Bon</MenuItem>
                    <MenuItem value="Moyen">Moyen</MenuItem>
                    <MenuItem value="Mauvais">Mauvais</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    variant="filled"
                    label="Étiquetage externe"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.etiquetage_externe}
                    name="etiquetage_externe"
                    error={!!touched.etiquetage_externe && !!errors.etiquetage_externe}
                    helperText={touched.etiquetage_externe && errors.etiquetage_externe}
                  >
                    <MenuItem value="Présent">Présent</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                    <MenuItem value="Dégradé">Dégradé</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    variant="filled"
                    label="État général"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.etat}
                    name="etat"
                    error={!!touched.etat && !!errors.etat}
                    helperText={touched.etat && errors.etat}
                  >
                    <MenuItem value="Fonctionnel">Fonctionnel</MenuItem>
                    <MenuItem value="Partiel">Partiellement fonctionnel</MenuItem>
                    <MenuItem value="Non fonctionnel">Non fonctionnel</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Nombre de splitters"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nombre_splitter}
                    name="nombre_splitter"
                    error={!!touched.nombre_splitter && !!errors.nombre_splitter}
                    helperText={touched.nombre_splitter && errors.nombre_splitter}
                    InputProps={{ inputProps: { min: 1, max: 2 } }}
                  />
                </Grid>
              </Grid>
            </Box>

            {values.nombre_splitter >= 1 && (
              <Box mb={3}>
                <Typography variant="h4" color={colors.greenAccent[400]}>
                  Splitter 1
                </Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Ports physiques"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ports_physiques_spl1}
                      name="ports_physiques_spl1"
                      error={!!touched.ports_physiques_spl1 && !!errors.ports_physiques_spl1}
                      helperText={touched.ports_physiques_spl1 && errors.ports_physiques_spl1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Puissance d'entrée (dBm)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.puissance_entree_spl1}
                      name="puissance_entree_spl1"
                      error={!!touched.puissance_entree_spl1 && !!errors.puissance_entree_spl1}
                      helperText={touched.puissance_entree_spl1 && errors.puissance_entree_spl1}
                      inputProps={{ step: "0.1" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Puissance de sortie (dBm)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.puissance_sortie_spl1}
                      name="puissance_sortie_spl1"
                      error={!!touched.puissance_sortie_spl1 && !!errors.puissance_sortie_spl1}
                      helperText={touched.puissance_sortie_spl1 && errors.puissance_sortie_spl1}
                      inputProps={{ step: "0.1" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="FSP"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.fsp_spl1}
                      name="fsp_spl1"
                      error={!!touched.fsp_spl1 && !!errors.fsp_spl1}
                      helperText={touched.fsp_spl1 && errors.fsp_spl1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="OLT"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.olt_spl1}
                      name="olt_spl1"
                      error={!!touched.olt_spl1 && !!errors.olt_spl1}
                      helperText={touched.olt_spl1 && errors.olt_spl1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Ports actifs"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ports_actifs_spl1}
                      name="ports_actifs_spl1"
                      error={!!touched.ports_actifs_spl1 && !!errors.ports_actifs_spl1}
                      helperText={touched.ports_actifs_spl1 && errors.ports_actifs_spl1}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {values.nombre_splitter >= 2 && (
              <Box mb={3}>
                <Typography variant="h4" color={colors.greenAccent[400]}>
                  Splitter 2
                </Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Ports physiques"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ports_physiques_spl2}
                      name="ports_physiques_spl2"
                      error={!!touched.ports_physiques_spl2 && !!errors.ports_physiques_spl2}
                      helperText={touched.ports_physiques_spl2 && errors.ports_physiques_spl2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Puissance d'entrée (dBm)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.puissance_entree_spl2}
                      name="puissance_entree_spl2"
                      error={!!touched.puissance_entree_spl2 && !!errors.puissance_entree_spl2}
                      helperText={touched.puissance_entree_spl2 && errors.puissance_entree_spl2}
                      inputProps={{ step: "0.1" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Puissance de sortie (dBm)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.puissance_sortie_spl2}
                      name="puissance_sortie_spl2"
                      error={!!touched.puissance_sortie_spl2 && !!errors.puissance_sortie_spl2}
                      helperText={touched.puissance_sortie_spl2 && errors.puissance_sortie_spl2}
                      inputProps={{ step: "0.1" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="FSP"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.fsp_spl2}
                      name="fsp_spl2"
                      error={!!touched.fsp_spl2 && !!errors.fsp_spl2}
                      helperText={touched.fsp_spl2 && errors.fsp_spl2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="OLT"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.olt_spl2}
                      name="olt_spl2"
                      error={!!touched.olt_spl2 && !!errors.olt_spl2}
                      helperText={touched.olt_spl2 && errors.olt_spl2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Ports actifs"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ports_actifs_spl2}
                      name="ports_actifs_spl2"
                      error={!!touched.ports_actifs_spl2 && !!errors.ports_actifs_spl2}
                      helperText={touched.ports_actifs_spl2 && errors.ports_actifs_spl2}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box mb={3}>
              <Typography variant="h4" color={colors.greenAccent[400]}>
                Informations techniques complémentaires
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="FDT (optionnel)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fdt}
                    name="fdt"
                    error={!!touched.fdt && !!errors.fdt}
                    helperText={touched.fdt && errors.fdt}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Central (optionnel)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.central}
                    name="central"
                    error={!!touched.central && !!errors.central}
                    helperText={touched.central && errors.central}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="filled"
                    multiline
                    rows={4}
                    label="Remarques"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.remarque}
                    name="remarque"
                    error={!!touched.remarque && !!errors.remarque}
                    helperText={touched.remarque && errors.remarque}
                  />
                </Grid>
              </Grid>
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
                    <span>Enregistrement en cours...</span>
                  </Box>
                ) : (
                  'Soumettre le rapport d\'intervention'
                )}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Valeurs initiales pour le formulaire
const initialValues = {
  fat: "",
  quartier: "",
  localisation: "",
  longitude: "",
  latitude: "",
  type_appui: "",
  etat_appui: "",
  etiquetage_externe: "",
  etat: "",
  nombre_splitter: 1,
  
  // Splitter 1
  ports_physiques_spl1: "0",
  puissance_entree_spl1: "0",
  puissance_sortie_spl1: "0",
  fsp_spl1: "",
  olt_spl1: "",
  ports_actifs_spl1: "0",
  
  // Splitter 2
  ports_physiques_spl2: "0",
  puissance_entree_spl2: "0",
  puissance_sortie_spl2: "0",
  fsp_spl2: "",
  olt_spl2: "",
  ports_actifs_spl2: "0",
  
  fdt: "",
  central: "",
  remarque: ""
};

// Schéma de validation
const interventionSchema = yup.object().shape({
    fat: yup.string().required("Le FAT est requis"),
    quartier: yup.string().required("Le quartier est requis"),
    localisation: yup.string().required("La localisation est requise"),
    longitude: yup.string().nullable(),
    latitude: yup.string().nullable(),
    type_appui: yup.string().required("Le type d'appui est requis"),
    etat_appui: yup.string().required("L'état de l'appui est requis"),
    etiquetage_externe: yup.string().required("L'étiquetage externe est requis"),
    etat: yup.string().required("L'état est requis"),
    nombre_splitter: yup.number()
      .required("Le nombre de splitters est requis")
      .min(1, "Minimum 1")
      .max(2, "Maximum 2")
      .integer("Le nombre doit être un entier"),
  
    // Splitter 1 (si nombre_splitter >= 1)
    ports_physiques_spl1: yup.number().when('nombre_splitter', {
      is: (val) => val >= 1,
      then: () => yup.number().integer(),
    }),
    puissance_entree_spl1: yup.number().when('nombre_splitter', {
      is: (val) => val >= 1,
      then: () => yup.number(),
    }),
    puissance_sortie_spl1: yup.number().when('nombre_splitter', {
      is: (val) => val >= 1,
      then: () => yup.number(),
    }),
    fsp_spl1: yup.string().when('nombre_splitter', {
      is: (val) => val >= 1,
      then: () => yup.string(),
    }),
    olt_spl1: yup.string().when('nombre_splitter', {
      is: (val) => val >= 1,
      then: () => yup.string(),
    }),
    ports_actifs_spl1: yup.number().when('nombre_splitter', {
      is: (val) => val >= 1,
      then: () => yup.number().integer(),
    }),
  
    // Splitter 2 (si nombre_splitter >= 2)
    ports_physiques_spl2: yup.number().when('nombre_splitter', {
      is: (val) => val >= 2,
      then: () => yup.number().integer(),
    }),
    puissance_entree_spl2: yup.number().when('nombre_splitter', {
      is: (val) => val >= 2,
      then: () => yup.number(),
    }),
    puissance_sortie_spl2: yup.number().when('nombre_splitter', {
      is: (val) => val >= 2,
      then: () => yup.number(),
    }),
    fsp_spl2: yup.string().when('nombre_splitter', {
      is: (val) => val >= 2,
      then: () => yup.string(),
    }),
    olt_spl2: yup.string().when('nombre_splitter', {
      is: (val) => val >= 2,
      then: () => yup.string(),
    }),
    ports_actifs_spl2: yup.number().when('nombre_splitter', {
      is: (val) => val >= 2,
      then: () => yup.number().integer(),
    }),
  
    fdt: yup.string(),
    central: yup.string(),
    remarque: yup.string()
  });
  
export default InterventionPage;