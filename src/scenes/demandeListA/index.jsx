import { useState, useContext, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { apiDemande } from "../../api";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const DemandeLA = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [propositions, setPropositions] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // État pour suivre les propositions acceptées
  const [acceptedPropositions, setAcceptedPropositions] = useState({});
      
  
  // Fonction pour rediriger vers la page de proposition a d'une demande a un technicien
  const handleIntervention = (id) => {
    navigate(`/proposition/${id}/`);
  };

  // Définition des colonnes pour la DataGrid
  const columns = [
    {
      field: "date_envoie",
      headerName: "Date de création",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "client_username",
      headerName: "Abonné",
      flex: 1,
    },
    {
      field: "probleme",
      headerName: "Problème",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => {
        const isAccepted = acceptedPropositions[params.row.id] || true;
        
        return (
          <Box display="flex" gap={1}>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleIntervention(params.row.id)}
                sx={{
                  backgroundColor: colors.blueAccent[600],
                  '&:hover': {
                    backgroundColor: colors.blueAccent[700],
                  }
                }}
              >
                Proposer
              </Button>
          </Box>
        );
      }
    }
  ];

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await apiDemande.get("list/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Vérifier si la réponse est au format attendu
        if (response.data && Array.isArray(response.data[0]?.results)) {
          const demandesData = response.data[0].results.flat(); // Aplatir le tableau de propositions
          const sortedDemandes = demandesData.sort(
            (a, b) => new Date(b.date_envoie) - new Date(a.date_envoie)
          );
          setDemandes(sortedDemandes);
        } else {
          console.error("❌ Format de réponse inattendu");
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des demandes :", error);
      }
      setLoading(false);
    };

    fetchDemandes();
  }, [token]);

  return (
    <Box m="20px">
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mb={2}
      >
        <Header 
          title="PROPOSITIONS" 
          subtitle="Liste des propositions reçues" 
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
          rows={demandes}
          columns={columns}
          loading={loading}
          slots={{
            toolbar: GridToolbar,
          }}
          getRowId={(row) => row.id}
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
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default DemandeLA;