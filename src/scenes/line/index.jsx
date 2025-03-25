import { Box } from "@mui/material";
import Header from "../../components/Header";
// import LineChart from "../../components/LineChart";
import LineChartU from "../../components/LineChartU";
const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh" minHeight="400px">
        <LineChartU />
      </Box>
    </Box>
  );
};

export default Line;
