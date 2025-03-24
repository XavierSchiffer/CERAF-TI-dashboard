import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    useTheme, 
    TextField, 
    MenuItem,
    IconButton, 
    Tooltip 
  } from '@mui/material';
import { Formik } from "formik";
import { 
    ArrowBackIosNew as BackIcon, 
    RefreshOutlined as RefreshIcon, 
    FilterListOutlined as FilterIcon, 
    CloudDownloadOutlined as ExportIcon,
    VisibilityOutlined as ViewIcon,
    DeleteOutlined as DeleteIcon
  } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiDemande } from '../../api';
import * as yup from 'yup'
import Header from "../../components/Header";
import { tokens } from "../../theme";

const CreeDemande = () => {
  const theme = useTheme();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          if (storedUser.role !== "SADMIN") {
              setError("Accès refusé. Seuls les administrateurs peuvent ajouter un utilisateur.");
          }
      } else {
          setError("Erreur d'authentification. Veuillez vous reconnecter.");
      }
  }, []);

  const handleFormSubmit = async (values) => {
      setMessage("");
      setError("");
      setLoading(true);

      if (!token) {
          setError("Erreur d'authentification. Veuillez vous reconnecter.");
          setLoading(false);
          return;
      }

      try {
          const response = await apiDemande.post("send/", values, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          });

          setMessage("Demande creé avec succès !");
          setTimeout(() => navigate("/dashboard"), 2000);
      } catch (error) {
          setError(error.response?.data?.message || "Erreur lors de la creation de la demande.");
      } finally {
          setLoading(false);
      }
  };

  if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
  }


  return (
      <Box m="20px">
           {/* En-tête avec bouton retour */}
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between" 
      mb={2}
    >
      <Tooltip title="Retour à la page précédente">
        <IconButton 
          onClick={() => navigate(-1)}
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
        title="Creation d'une demande" 
        subtitle="Formulaire pour creer une demande pour un abonné" 
      />
    </Box>
          <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={userSchema}
          >
              {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                      <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                          <TextField
                              fullWidth
                              variant="filled"
                              type="text"
                              label="Nom d'utilisateur de l'abonné en charge"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.username}
                              name="username"
                              error={!!touched.username && !!errors.username}
                              helperText={touched.username && errors.username}
                              sx={{ gridColumn: "span 2" }}
                          />
                          <TextField
                              fullWidth
                              variant="filled"
                              type="text"
                              label="Probleme de l'abonné"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.probleme}
                              name="probleme"
                              error={!!touched.probleme && !!errors.probleme}
                              helperText={touched.probleme && errors.probleme}
                              sx={{ gridColumn: "span 2" }}
                          />
                      </Box>
                      <Box display="flex" justifyContent="end" mt="20px">
                          <Button type="submit" color="secondary" variant="contained" disabled={loading}>
                              {loading ? "Creation en cours..." : "Creer demande."}
                          </Button>
                      </Box>
                      {message && <p style={{ color: "green" }}>{message}</p>}
                  </form>
              )}
          </Formik>
      </Box>
  );
};

const userSchema = yup.object().shape({
    probleme: yup.string().required("Le problème de l'abonné est requis."),
    username: yup.string().required("Le nom d'utilsateur de l'abonné est requis."),
  });

const initialValues = {
  probleme: "",
  username: "",
};

export default CreeDemande;
