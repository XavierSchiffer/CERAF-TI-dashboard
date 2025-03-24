import React, { useState, useEffect } from "react";
import { Box, Button, TextField, MenuItem, Typography, useTheme, useMediaQuery, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header"; // Assurez-vous que ce chemin est correct
import { tokens } from "../../theme"; // Assurez-vous que ce chemin est correct
import { apiAccount } from "../../api";

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("TI");
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);

      if (storedUser.role !== "ADMIN" && storedUser.role !== "SADMIN") {
        setError("Accès refusé. Seuls les administrateurs peuvent ajouter un utilisateur.");
      }
    } else {
      setError("Erreur d'authentification. Veuillez vous reconnecter.");
    }
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    setMessage("");
    setError("");
    setLoading(true);

    if (!token) {
      setError("Erreur d'authentification. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      // Endpoint basé sur le rôle sélectionné
      const endpoint = selectedRole === "TI" 
        ? "sadmin/registration/TI" 
        : "sadmin/registration/abonne";

      const response = await apiAccount.post(endpoint, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage(`${selectedRole === "TI" ? "Technicien" : "Abonné"} ajouté avec succès !`);
      resetForm();
      // Rediriger après 2 secondes
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        `Erreur lors de l'ajout de l'${selectedRole === "TI" ? "technicien" : "abonné"}.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Schémas de validation pour chaque type d'utilisateur
  const tiSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    email: yup.string().email("Email invalide").required("L'email est requis"),
    telephone: yup.string(),
  });

  const abonneSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    email: yup.string().email("Email invalide").required("L'email est requis"),
    telephone: yup.string(),
    statut_social: yup.string(),
    localisation: yup.string(),
    OLT: yup.string(),
    FDT: yup.string(),
    FSP: yup.string(),
    FAT: yup.string(),
    spliteur: yup.string(),
    num_port_fat: yup.string(),
  });

  // Valeurs initiales pour chaque type d'utilisateur
  const tiInitialValues = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  };

  const abonneInitialValues = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    statut_social: "",
    localisation: "",
    OLT: "",
    FDT: "",
    FSP: "",
    FAT: "",
    spliteur: "",
    num_port_fat: "",
  };

  if (error) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* En-tête avec sélecteur de rôle */}
      <Box 
        display="flex" 
        flexDirection={isNonMobile ? "row" : "column"}
        alignItems={isNonMobile ? "center" : "flex-start"} 
        justifyContent="space-between" 
        mb={3}
      >
        <Header 
          title={`Ajouter un ${selectedRole === "TI" ? "technicien" : "abonné"}`} 
          subtitle={`Formulaire pour ajouter un ${selectedRole === "TI" ? "technicien" : "abonné"}`} 
        />
        
        <TextField
          select
          label="Type d'utilisateur"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          variant="filled"
          sx={{ 
            minWidth: 200, 
            mt: isNonMobile ? 0 : 2,
            "& .MuiInputBase-root": {
              backgroundColor: colors.primary[400]
            }
          }}
        >
          <MenuItem value="TI">Technicien (TI)</MenuItem>
          <MenuItem value="ABONNE">Abonné</MenuItem>
        </TextField>
      </Box>

      {/* Formulaire dynamique basé sur le rôle sélectionné */}
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={selectedRole === "TI" ? tiInitialValues : abonneInitialValues}
        validationSchema={selectedRole === "TI" ? tiSchema : abonneSchema}
        enableReinitialize={true}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box 
              display="grid" 
              gap="30px" 
              gridTemplateColumns={`repeat(${isNonMobile ? 4 : 1}, minmax(0, 1fr))`}
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 1" },
              }}
            >
              {/* Champs communs pour les deux types d'utilisateurs */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nom}
                name="nom"
                error={!!touched.nom && !!errors.nom}
                helperText={touched.nom && errors.nom}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Prénom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.prenom}
                name="prenom"
                error={!!touched.prenom && !!errors.prenom}
                helperText={touched.prenom && errors.prenom}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Téléphone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telephone}
                name="telephone"
                error={!!touched.telephone && !!errors.telephone}
                helperText={touched.telephone && errors.telephone}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Champs spécifiques pour les abonnés */}
              {selectedRole === "ABONNE" && (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Statut Social"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.statut_social}
                    name="statut_social"
                    error={!!touched.statut_social && !!errors.statut_social}
                    helperText={touched.statut_social && errors.statut_social}
                    sx={{ gridColumn: "span 2" }}
                  />
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
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="OLT"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.OLT}
                    name="OLT"
                    error={!!touched.OLT && !!errors.OLT}
                    helperText={touched.OLT && errors.OLT}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="FDT"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.FDT}
                    name="FDT"
                    error={!!touched.FDT && !!errors.FDT}
                    helperText={touched.FDT && errors.FDT}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="FSP"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.FSP}
                    name="FSP"
                    error={!!touched.FSP && !!errors.FSP}
                    helperText={touched.FSP && errors.FSP}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="FAT"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.FAT}
                    name="FAT"
                    error={!!touched.FAT && !!errors.FAT}
                    helperText={touched.FAT && errors.FAT}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Spliteur"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.spliteur}
                    name="spliteur"
                    error={!!touched.spliteur && !!errors.spliteur}
                    helperText={touched.spliteur && errors.spliteur}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Numéro Port FAT"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.num_port_fat}
                    name="num_port_fat"
                    error={!!touched.num_port_fat && !!errors.num_port_fat}
                    helperText={touched.num_port_fat && errors.num_port_fat}
                    sx={{ gridColumn: "span 2" }}
                  />
                </>
              )}
            </Box>

            {/* Boutons */}
            <Box display="flex" justifyContent="space-between" mt="30px">
              <Button 
                type="button" 
                color="error" 
                variant="contained" 
                onClick={() => navigate("/dashboard")}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained" 
                disabled={loading}
                sx={{ 
                  backgroundColor: colors.greenAccent[600],
                  "&:hover": { backgroundColor: colors.greenAccent[700] }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Ajouter ${selectedRole === "TI" ? "Technicien" : "Abonné"}`
                )}
              </Button>
            </Box>

            {/* Message de succès */}
            {message && (
              <Box mt={2}>
                <Typography variant="body1" color="success.main">
                  {message}
                </Typography>
              </Box>
            )}
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UserRegistrationForm;