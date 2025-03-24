import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { apiAccount } from "../api"; // ajuste selon ton projet
import { CircularProgress, Box } from "@mui/material";

const BarChartMonthly = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const res = await apiAccount.get("sadmin/barchart/interventions/monthly/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = res.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          // Extraire les noms des techniciens dynamiquement
          const dynamicKeys = Object.keys(responseData[0]).filter((key) => key !== "mois");
          setKeys(dynamicKeys);
          setData(responseData);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des données BarChart :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarData();
  }, [token]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="mois"
      groupMode="grouped"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "set2" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Mois",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Interventions",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={true}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemWidth: 100,
          itemHeight: 20,
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [{ on: "hover", style: { itemOpacity: 1 } }],
        },
      ]}
      role="application"
    />
  );
};

export default BarChartMonthly;
