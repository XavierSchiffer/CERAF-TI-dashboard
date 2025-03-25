import React, { useState, useEffect, useContext } from 'react';
import { Box, useTheme, Typography, Grid } from '@mui/material';
import { ResponsiveContainer } from 'recharts';
import { tokens } from '../theme';
import AuthContext from '../context/AuthContext';
import { apiIntervention } from '../api';
import LineChart from './LineChart'; // Import du LineChart

const LineChartU = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { token } = useContext(AuthContext);
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchStatsData();
    }, []);

    const fetchStatsData = async () => {
      try {
        setLoading(true);
        const response = await apiIntervention.get("sadmin/linechart/interventions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("📈 Données LineChart :", response.data);
        
        // Vérifier si les données sont bien structurées
        if (response.data.length > 0) {
          setStatsData(response.data);
          setError(null);
        } else {
          setError("Aucune donnée disponible.");
          setStatsData([]);
        }
      } catch (error) {
        console.error("❌ Erreur chargement LineChart :", error);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid item xs={12} md={12}>
            <Box
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
              height="50vh"
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ color: colors.grey[100] }}
              >
                Évolution des interventions
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Top 3 techniciens - Année en cours
              </Typography>
              
              <Box height="400px" mt="20px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData} isDashboard={true} />
                </ResponsiveContainer>
              </Box>
            </Box>
        </Grid>
    );
};

export default LineChartU;
