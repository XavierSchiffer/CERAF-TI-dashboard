import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme, Grid, Paper } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import { useLocation } from 'react-router-dom';
import { Upload, Bell, User, Settings, Moon, LogOut, X, Home, Loader } from "lucide-react";
import { useState, useContext, useRef, useEffect } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
// import SettingsPopup from "./SettingsPopup";
import AuthContext from "../../context/AuthContext";
import { apiFruit } from "../../api";
import React from "react";
import "../Dashboard.css";


const DashboardTI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { token } = useContext(AuthContext);
  const location = useLocation();
  
  const [latestPapayaData, setLatestPapayaData] = useState({
    pourcentage_papaye_non_mur: 0,
    pourcentage_papaye_semi_mur: 0,
    pourcentage_papaye_mur: 0,
    date_derniere_analyse: "N/A",
  });

  const [papayaList, setPapayaList] = useState([]);  
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const fetchPapayaInfo = async () => {
    try {
        const response = await apiFruit.get("/papayes/list/", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Réponse du backend :", response.data);

        if (response.data.length > 0 && response.data[0].state === "SUCCES") {
            const papayaList = response.data[0].results;
            if (papayaList.length > 0 && papayaList[0].length > 0) {
                const latestPapaya = papayaList[0][0];
                
                setLatestPapayaData({
                    pourcentage_papaye_non_mur: parseFloat(latestPapaya.pourcentage_papaye_non_mur),
                    pourcentage_papaye_semi_mur: parseFloat(latestPapaya.pourcentage_papaye_semi_mur),
                    pourcentage_papaye_mur: parseFloat(latestPapaya.pourcentage_papaye_mur),
                    date_derniere_analyse: latestPapaya.date_derniere_analyse || "N/A",
                });

                console.log("✅ Données mises à jour :", latestPapaya);
            } else {
                console.warn("⚠️ Aucune donnée de papaye trouvée.");
            }
        }
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des informations sur la papaye :", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPapayaInfo();
    }
  }, [token]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await apiFruit.post("/secteurs/papaye/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("✅ Réponse complète du backend :", response.data);
  
      const responseData = response.data[0];
  
      if (responseData.state === "SUCCES") {
        setSuccess(responseData.message);
        setAnalysisResults(responseData.results[0]);
  
        setTimeout(() => {
          setSuccess(false);
          setSelectedImage(null);
          setPreview(null);
        }, 3000);
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de l'envoi de l'image");
      console.error("❌ Erreur lors de l'envoi :", error);
    }
  
    setLoading(false);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Box 
      sx={{ 
        height: "calc(100vh - 40px)",
        m: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            },
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>

      {/* MAIN CONTENT */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* LEFT SIDE - Upload and Preview */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              height: "95%",
              backgroundColor: colors.primary[400],
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            <Typography variant="h5" fontWeight="600" sx={{ color: colors.grey[100] }}>
              Sélectionnez une image
            </Typography>
            
            {/* Upload Card */}
            <Box 
              sx={{ 
                border: `2px dashed ${colors.grey[300]}`,
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                mb: 2,
                flex: preview ? "0 0 auto" : 1,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="upload"
                style={{ display: "none" }}
              />
              <label htmlFor="upload" style={{ cursor: "pointer" }}>
                <Upload size={40} color={colors.grey[100]} />
                <Typography sx={{ mt: 1, color: colors.grey[100] }}>
                  Cliquez pour sélectionner une image
                </Typography>
              </label>
            </Box>

            {/* Preview */}
            {preview && (
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box 
                  sx={{ 
                    flex: 1,
                    position: "relative",
                    height: "300px",
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }
                  }}
                >
                  <img src={preview} alt="Prévisualisation" />
                </Box>
                {error && (
                  <Typography color="error" sx={{ textAlign: "center" }}>
                    {error}
                  </Typography>
                )}
                {success && (
                  <Typography sx={{ textAlign: "center", color: colors.greenAccent[500] }}>
                    {success}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={handleUpload}
                  sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    "&:hover": { backgroundColor: colors.blueAccent[600] },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Loader size={20} className="animate-spin" />
                      <span>Envoi en cours...</span>
                    </Box>
                  ) : (
                    "Soumettre l'image"
                  )}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* RIGHT SIDE - Results */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              height: "95%",
              backgroundColor: colors.primary[400],
              display: "flex",
              flexDirection: "column"
            }}
          >
            {(analysisResults || latestPapayaData.pourcentage_papaye_mur > 0) ? (
              <>
                <Typography variant="h4" fontWeight="600" mb={2} sx={{ color: colors.grey[100] }}>
                  Résultats de l'analyse
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: colors.primary[500],
                      borderRadius: 1,
                      textAlign: "center"
                    }}>
                      <Typography variant="h4" sx={{ color: "white" }}>
                        {analysisResults?.pourcentage_papaye_non_mur ?? latestPapayaData.pourcentage_papaye_non_mur}%
                      </Typography>
                      <Typography sx={{ color: "white" }}>
                        Papaye non-mûre
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: colors.primary[500],
                      borderRadius: 1,
                      textAlign: "center"
                    }}>
                      <Typography variant="h4" sx={{ color: "white" }}>
                        {analysisResults?.pourcentage_papaye_semi_mur ?? latestPapayaData.pourcentage_papaye_semi_mur}%
                      </Typography>
                      <Typography sx={{ color: "white" }}>
                        Papaye semi-mûre
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: colors.primary[500],
                      borderRadius: 1,
                      textAlign: "center"
                    }}>
                      <Typography variant="h4" sx={{ color: "white" }}>
                        {analysisResults?.pourcentage_papaye_mur ?? latestPapayaData.pourcentage_papaye_mur}%
                      </Typography>
                      <Typography sx={{ color: "white" }}>
                        Papaye mûre
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography sx={{ mb: 2, color: colors.grey[100] }}>
                  Date d'analyse : {analysisResults?.date_derniere_analyse ?? latestPapayaData.date_derniere_analyse}
                </Typography>

                <Box sx={{ flex: 1, minHeight: "200px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Mûres', value: parseFloat(analysisResults?.pourcentage_papaye_mur ?? latestPapayaData.pourcentage_papaye_mur) },
                          { name: 'Non Mûres', value: parseFloat(analysisResults?.pourcentage_papaye_non_mur ?? latestPapayaData.pourcentage_papaye_non_mur) },
                          { name: 'Semi-Mûres', value: parseFloat(analysisResults?.pourcentage_papaye_semi_mur ?? latestPapayaData.pourcentage_papaye_semi_mur) }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: colors.primary[400],
                          borderColor: colors.grey[100],
                          color: colors.grey[100]
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}>
                <Typography variant="h5" sx={{ mb: 2, color: colors.grey[100] }}>
                  Aucun résultat pour le moment
                </Typography>
                <Typography sx={{ color: colors.grey[100] }}>
                  Envoyez une image pour obtenir une analyse
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardTI;