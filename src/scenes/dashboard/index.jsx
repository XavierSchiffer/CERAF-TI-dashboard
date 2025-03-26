import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import BuildIcon from "@mui/icons-material/Build";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
// import BarChartMonthly from "../../components/BarChartMonthly";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { apiIntervention, apiAccount } from "../../api";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";



const DashboardTI = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [userCountValueA, setUserCountA] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [intervCount, setIntervCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [apiMessage, setApiMessage] = useState("");
  const [periode, setPeriode] = useState(""); 
  const [lineChartData, setLineChartData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const formatDateFr = (isoDateStr) => {
    if (!isoDateStr) return "Non disponible";
    const date = new Date(isoDateStr);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
    });
  };
  

  const handleDownload = async () => {
    try {
      // Envoi de la requête GET pour télécharger le fichier Excel
      const response = await apiIntervention.get('export-interventions/', {
        responseType: 'blob', // Pour obtenir le fichier binaire
      });

      // Créer un lien de téléchargement temporaire
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'interventions.xlsx'; // Nom du fichier téléchargé
      link.click(); // Lancer le téléchargement
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };
  
  useEffect(() => {
    const fetchAdminCount = async () => {
      try {
        const response = await apiAccount.get("sadmin/admins/count/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Réponse API :", response.data);

        // Vérification que la réponse contient bien "results"
        if (!response.data?.results || !Array.isArray(response.data.results) || response.data.results.length === 0) {
          console.error("❌ Erreur : 'results' est absent ou non valide.");
          return;
        }

        // Extraction du nombre d’abonné
        const adminCountValue = response.data.results[0]?.nombre_admin?? 0;
        console.log("👥 Nombre d’administrateur :", adminCountValue);

        setAdminCount(adminCountValue);
      } catch (error) {
        console.error("❌ Erreur lors du chargement du nombre d’admins :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminCount();
  }, []);
  useEffect(() => {
    const fetchIntervCount = async () => {
      try {
        const response = await apiAccount.get("sadmin/interventions/count/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Réponse API :", response.data);

        // Vérification que la réponse contient bien "results"
        if (!response.data?.results || !Array.isArray(response.data.results) || response.data.results.length === 0) {
          console.error("❌ Erreur : 'results' est absent ou non valide.");
          return;
        }

        // Extraction du nombre d’abonné
        const intervCountValue = response.data.results[0]?.nombre_intervention?? 0;
        console.log("👥 Nombre d’intervention :", intervCountValue);

        setIntervCount(intervCountValue);
      } catch (error) {
        console.error("❌ Erreur lors du chargement du nombre d’interventions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervCount();
  }, []);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await apiAccount.get("sadmin/abonnes/count/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Réponse API :", response.data);

        // Vérification que la réponse contient bien "results"
        if (!response.data?.results || !Array.isArray(response.data.results) || response.data.results.length === 0) {
          console.error("❌ Erreur : 'results' est absent ou non valide.");
          return;
        }

        // Extraction du nombre d’abonné
        const userCountValue = response.data.results[0]?.nombre_abonné?? 0;
        console.log("👥 Nombre d’abonné :", userCountValue);

        setUserCount(userCountValue);
      } catch (error) {
        console.error("❌ Erreur lors du chargement du nombre d’abonnés :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersCount();
  }, []);


  useEffect(() => {
    const fetchUsersCountA = async () => {
      try {
        const response = await apiAccount.get("sadmin/techniciens/count/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Réponse API :", response.data);

        // Vérification que la réponse contient bien "results"
        if (!response.data?.results || !Array.isArray(response.data.results) || response.data.results.length === 0) {
          console.error("❌ Erreur : 'results' est absent ou non valide.");
          return;
        }

        // Extraction du nombre d’utilisateurs
        const userCountValueA = response.data.results[0]?.nombre_techniciens ?? 0;
        console.log("👥 Nombre de technicien :", userCountValueA);

        setUserCountA(userCountValueA);
      } catch (error) {
        console.error("❌ Erreur lors du chargement du nombre de techniciens :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersCountA();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiAccount.get("sadmin/list/techniciens", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("✅ Réponse complète :", response.data);
  
        const firstResponse = response.data[0];
        const techniciens = firstResponse?.results?.[0];
  
        if (!Array.isArray(techniciens)) {
          console.error("❌ Données invalides ou absentes.");
          return;
        }
  
        setUsers(techniciens);
        
        const msg = firstResponse.message || "Top 3 des techniciens";
        setApiMessage(msg);
  
        // Extraction de la période depuis le message s'il contient "mois de March 2025"
        const periodeMatch = msg.match(/mois de ([A-Za-zéû]+\s+\d{4})/i);
        setPeriode(periodeMatch ? periodeMatch[1] : "Période inconnue");
  
      } catch (error) {
        console.error("❌ Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  
  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await apiIntervention.get("sadmin/linechart/interventions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📈 Données LineChart :", response.data);
        setLineChartData(response.data);
      } catch (error) {
        console.error("❌ Erreur chargement LineChart :", error);
      }
    };
  
    fetchLineChartData();
  }, []);

  useEffect(() => {

    const fetchPieData = async () => {
      const res = await apiIntervention.get("sadmin/piechart/interventions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPieData(res.data);
    };

    fetchPieData();
  }, []);

  const parseFrenchDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            onClick={handleDownload} // Appel de la fonction de téléchargement
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]} // Remplace `colors.primary[400]` si non défini
            display="flex"
            alignItems="center"
            justifyContent="center"
          >

            <StatBox
              title={loading ? "Chargement..." : adminCount}
              subtitle="Nombre(s) d'administrateur(s)"
              progress="0.30"
              increase="+5%"
              icon={
                <AdminPanelSettingsIcon  sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
              }
            />
        </Box>
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]} // Remplace `colors.primary[400]` si non défini
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={loading ? "Chargement..." : intervCount}
              subtitle="Nombre(s) d'intervention(s)"
              progress="0.30"
              increase="+5%"
              icon={
                <BuildIcon  sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
              }
            />
          </Box>
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]} // Remplace `colors.primary[400]` si non défini
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={loading ? "Chargement..." : userCountValueA}
              subtitle="Nombre(s) Technicien(s)"
              progress="0.30"
              increase="+5%"
              icon={
                <EngineeringIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
              }
            />
        </Box>
        <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]} // Remplace `colors.primary[400]` si non défini
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={loading ? "Chargement..." : userCount}
              subtitle="Nombre(s) abonné(s)"
              progress="0.30"
              increase="+5%"
              icon={
                <PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
              }
            />
          </Box>
        {/* ROW 2 */}

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Évolution mensuelle des interventions
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Top 3 techniciens - Année en cours
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart data={lineChartData} isDashboard={true} />
          </Box>
        </Box>

        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            {apiMessage || "Chargement..."}
          </Typography>
          <Typography color={colors.greenAccent[400]} variant="body2" fontStyle="italic">
            Période : {periode}
          </Typography>
        </Box>

        {loading ? (
          <Typography color={colors.grey[100]} p="15px">
            Chargement...
          </Typography>
        ) : users.length === 0 ? (
          <Typography
            color={colors.redAccent[400]}
            fontWeight="bold"
            textAlign="center"
            p="15px"
          >
            Aucune intervention enregistrée ce mois.
          </Typography>
        ) : (
          users.map((user) => (
            <Box
              key={user.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                  {user.nombre_interventions} intervention{user.nombre_interventions > 1 ? "s" : ""}
                </Typography>
                <Typography color={colors.grey[100]}>{user.username}</Typography>
              </Box>
              <Box color={colors.grey[100]}>
                {formatDateFr(user.derniere_intervention)}
              </Box>
            </Box>
          ))
        )}
      </Box>

        {/* ROW 3 */}
      <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]} padding={"30px"}>
        <Typography variant="h5" fontWeight="600" sx={{ padding: "30px" }}>
          Répartition des Interventions (Pie)
        </Typography>
        <Box height="200px">
          <PieChart data={pieData} />
        </Box>
      </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>


      </Box>
    </Box>
  );
};

export default DashboardTI;
