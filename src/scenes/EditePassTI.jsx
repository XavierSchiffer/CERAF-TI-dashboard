import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../theme";
import AuthContext from "../context/AuthContext";
import { apiAccount } from "../api";
import { ArrowLeft } from "lucide-react";

const EditPasswordTI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const response = await apiAccount.post("/users/update/pass/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = response.data[0];

      if (responseData.state === "SUCCES") {
        setSuccess(responseData.message);
        setTimeout(() => navigate("/dashboardTI"), 2000);
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la modification du mot de passe");
      console.error("❌ Erreur lors de la modification du mot de passe:", error);
    }
    setLoading(false);
  };

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

        <Typography variant="h2">Modifier le mot de passe</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="grid" gap="20px">
          {['current', 'new', 'confirm'].map((field) => (
            <TextField
              key={field}
              fullWidth
              variant="filled"
              label={
                field === 'current' ? 'Mot de passe actuel' :
                field === 'new' ? 'Nouveau mot de passe' :
                'Confirmer le nouveau mot de passe'
              }
              name={`${field}_password`}
              type={showPasswords[field] ? "text" : "password"}
              value={formData[`${field}_password`]}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => togglePasswordVisibility(field)}>
                    {showPasswords[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                )
              }}
            />
          ))}
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
                <span>Modification en cours...</span>
              </Box>
            ) : (
              'Modifier le mot de passe'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditPasswordTI;
