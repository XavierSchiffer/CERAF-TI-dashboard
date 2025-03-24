import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { ArrowLeft, Mail, Phone, Loader } from 'lucide-react';
import AuthContext from "../context/AuthContext";
import { apiAccount } from "../api";
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme"; // Assuming you have a token system for theme colors

const EditProfileA = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await apiAccount.get("/users/info/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.etat === "SUCCES") {
        setFormData(response.data.res);
      } else {
        setError(response.data.msg || "Erreur lors de la récupération des informations");
      }
    } catch (error) {
      setError("Erreur lors de la récupération des informations");
      console.error("❌ Erreur lors de la récupération des informations:", error);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiAccount.put("/users/update/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseData = response.data[0];

      if (responseData.state === "SUCCES") {
        setSuccess(responseData.message);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la mise à jour du profil");
      console.error("❌ Erreur lors de la mise à jour:", error);
    }
    setLoading(false);
  };

  if (initialLoad) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Loader className="animate-spin" size={40} />
        <Typography>Chargement du profil...</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <Tooltip title="Retour au tableau de bord">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              borderRadius: 2,
              '&:hover': { backgroundColor: colors.blueAccent[600] }
            }}
          >
            <ArrowLeft  />
          </IconButton>
        </Tooltip>

        <Typography variant="h2">Modifier mon profil</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{ "& > div": { gridColumn: "span 4" } }}>
          <TextField
            fullWidth
            variant="filled"
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            fullWidth
            variant="filled"
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            fullWidth
            variant="filled"
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            fullWidth
            variant="filled"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            fullWidth
            variant="filled"
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            disabled={loading}
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
              'Mettre à jour le profil'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditProfileA;
