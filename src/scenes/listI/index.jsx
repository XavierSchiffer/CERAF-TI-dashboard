import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton,
  Tooltip
} from '@mui/material';
import { useTheme } from "@mui/material";
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarFilterButton, 
  GridToolbarExport 
} from '@mui/x-data-grid';
import { 
  FilterListOutlined as FilterIcon, 
  CloudDownloadOutlined as ExportIcon,
  RefreshOutlined as RefreshIcon,
  VisibilityOutlined as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import { tokens } from '../../theme';
import { apiAccount } from '../../api';

const InterventionList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Updated columns to show only specified fields
  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1 
    },
    { 
      field: 'localisation', 
      headerName: 'Localisation', 
      flex: 1 
    },
    { 
      field: 'ceraf', 
      headerName: 'CERAF', 
      flex: 1 
    },
    { 
      field: 'fat', 
      headerName: 'FAT', 
      flex: 1 
    },
    { 
      field: 'quartier', 
      headerName: 'Quartier', 
      flex: 1 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Voir les détails">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleViewIntervention(params.row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Fetch interventions
  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await apiAccount.get("technicien/list/interventions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Réponse API :", response.data);
        
        // Adjust data extraction based on your API response structure
        const interventionsData = response.data?.[0]?.results?.[0] || []; 
    
        setInterventions(interventionsData);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des interventions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, []);

  // View intervention details
  const handleViewIntervention = (intervention) => {
    navigate(`/interventions/details/${intervention.id}`);
  };

  // Custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 1 
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <GridToolbarFilterButton startIcon={<FilterIcon />} />
          <GridToolbarExport 
            startIcon={<ExportIcon />} 
            printOptions={{ disableToolbarButton: true }}
          />
        </Box>
        <Tooltip title="Actualiser les données">
          <IconButton onClick={() => {/* Logique de rafraîchissement */}}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </GridToolbarContainer>
    );
  }

  return (
    <Box m="20px">
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={2}
      >
        <Header 
          title="INTERVENTIONS"
          subtitle="Liste des interventions" 
        />
      </Box>
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { 
            border: "none", 
            borderRadius: 3 
          },
          "& .MuiDataGrid-cell": { 
            borderBottom: "none" 
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
          "& .MuiDataGrid-virtualScroller": { 
            backgroundColor: colors.primary[400] 
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          },
          "& .MuiCheckbox-root": { 
            color: `${colors.greenAccent[200]} !important` 
          },
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: colors.primary[500],
            borderRadius: 2,
            p: 1,
          }
        }}
      >
        <DataGrid 
          rows={interventions} 
          columns={columns} 
          getRowId={(row) => row.id}
          loading={loading}
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={{
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: colors.blueAccent[500],
                transition: 'background-color 0.3s ease',
              }
            }
          }}
          initialState={{
            pagination: { 
              paginationModel: { pageSize: 10 } 
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
    </Box>
  );
};

export default InterventionList;