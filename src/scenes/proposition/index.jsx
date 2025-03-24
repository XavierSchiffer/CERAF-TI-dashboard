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

const Proposition = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
  
    const { idDemande } = useParams();
    const [propositions, setPropositions] = useState([]);
    const [interventionData, setInterventionData] = useState(null);

    useEffect(() => {
        console.log("🔍 ID de la demande récupéré depuis l'URL :", idDemande);
      }, [idDemande]);
  
    const handleFormSubmit = async (values) => {
      if (!idDemande) {
        setError("ID de la demande non trouvé");
        return;
      }
      if (!values.usernameTI) {
        setError("Le nom d'utilisateur du technicien est requis");
        return;
      }
  
      console.log("🔍 ID de la demande :", idDemande);
      console.log("👨‍🔧 Technicien :", values.usernameTI);
  
      setLoading(true);
      try {
        const response = await apiDemande.post(
          `/offre/`, // Vérifie que ton endpoint correspond bien !
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { usernameTI: values.usernameTI, idDemande: idDemande }, // ✅ Passer les paramètres en query params
          }
        );
        console.log("Donné du backend :", response.data);
  
        // Vérifie si la réponse contient un tableau et extrait le premier élément
        if (Array.isArray(response.data) && response.data.length > 0) {
            const data = response.data[0]; // Premier élément du tableau
    
            if (data.state === "SUCCES") {
            setSuccess(data.message);
            console.log("✅ Données de la proposition :", data.results);
    
            setTimeout(() => navigate("/dashboard"), 2000);
            } else {
            setError(data.message || "Erreur lors de l'envoi de la proposition");
            }
        } else {
            setError("Réponse inattendue du serveur");
        }
        } catch (error) {
        setError("Une erreur est survenue lors de l'envoi de la proposition.");
        console.error("❌ Erreur :", error.response?.data || error.message);
        }
        setLoading(false);
    };
  
    return (
      <Box m="20px">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          {/* <Tooltip title="Retour à la liste des propositions">
            <IconButton
              onClick={() => navigate("/propositions")}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                borderRadius: 2,
                "&:hover": { backgroundColor: colors.blueAccent[600] },
              }}
            >
              <BackIcon />
            </IconButton>
          </Tooltip> */}
  
          <Header title="PROPOSITION" subtitle="Formulaire de demande d'intervention" />
        </Box>
  
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={interventionSchema}>
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Typography variant="h4" color={colors.greenAccent[400]}>
                  {/* Informations générales */}
                </Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
  
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Nom du technicien"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.usernameTI}
                      name="usernameTI"
                      error={!!touched.usernameTI && !!errors.usernameTI}
                      helperText={touched.usernameTI && errors.usernameTI}
                    />
                  </Grid>
                </Grid>
              </Box>
  
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
  
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
                      <span>Envoi en cours...</span>
                    </Box>
                  ) : (
                    "Soumettre la proposition"
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  const initialValues = { usernameTI: "" };
  
  const interventionSchema = yup.object().shape({
    usernameTI: yup.string().required("Le Nom d'utilisateur du technicien est requis"),
  });
  
  export default Proposition;
  