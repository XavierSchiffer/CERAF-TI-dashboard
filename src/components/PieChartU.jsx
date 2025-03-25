import React, { useState, useEffect, useContext } from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import { apiIntervention } from '../api';  // Assurez-vous que l'API est bien configurée
import { tokens } from '../theme';
import PieChart from './PieChart';  // Importation du composant PieChart
import AuthContext from '../context/AuthContext';


const PieChartU = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pieData, setPieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  // Récupérer les données du graphique pie depuis l'API
  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const res = await apiIntervention.get("sadmin/piechart/interventions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPieData(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données du PieChart :", error);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchPieData();
  }, [token]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]} padding={"30px"}>
      <Typography variant="h5" fontWeight="600" sx={{ padding: "30px" }}>
        Répartition des Interventions (Pie)
      </Typography>
      <Box height="200px">
        {pieData && <PieChart data={pieData} />} {/* Affichage du PieChart avec les données récupérées */}
      </Box>
    </Box>
  );
};

export default PieChartU;
