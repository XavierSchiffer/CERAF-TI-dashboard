import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChartU from "../../components/PieChartU";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChartU />
      </Box>
    </Box>
  );
};

export default Pie;
