import { useState, useContext, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { apiDemande } from "../../api";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const DemandeL = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [propositions, setPropositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // État pour suivre les propositions acceptées
  const [acceptedPropositions, setAcceptedPropositions] = useState({});
  
  // Fonction pour gérer l'acceptation d'une proposition
  const handleAccept = async (id) => {
    try {
      const response = await apiDemande.post("offre/validation/", 
        { idProposition: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("📌 Réponse complète :", response.data); // 🔹 Debug
  
      // Correction ici : on prend le premier élément du tableau
      const responseData = response.data[0];  
  
      if (responseData.state === "SUCCES") {
        setAcceptedPropositions(prev => ({
          ...prev,
          [id]: true
        }));
      } else {
        console.error("❌ Erreur de validation :", responseData.message);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la validation :", error.response?.data || error.message);
    }
  };  
  
  
  // Fonction pour rediriger vers la page d'intervention
  const handleIntervention = (id) => {
    navigate(`/intervention/${id}`);
  };

  // Définition des colonnes pour la DataGrid
  const columns = [
    {
      field: "date_envoie",
      headerName: "Date d'envoi",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "client_username",
      headerName: "Client",
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
        const isAccepted = acceptedPropositions[params.row.id] || false;
        
        return (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                console.log("📌 params.row.id :", params.row.id);
                handleAccept(params.row.id);
              }}
              disabled={acceptedPropositions[params.row.id] || false}
              sx={{
                backgroundColor: colors.greenAccent[600],
                '&:hover': {
                  backgroundColor: colors.greenAccent[700],
                },
                '&.Mui-disabled': {
                  backgroundColor: colors.grey[500],
                  color: colors.grey[100]
                }
              }}
            >
              {acceptedPropositions[params.row.id] ? "Validé ✅" : "Accepter"}
            </Button>

            
            {isAccepted && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleIntervention(params.row.id)}
                sx={{
                  backgroundColor: colors.blueAccent[600],
                  '&:hover': {
                    backgroundColor: colors.blueAccent[700],
                  }
                }}
              >
                Intervention
              </Button>
            )}
          </Box>
        );
      }
    }
  ];

  useEffect(() => {
    const fetchPropositions = async () => {
      try {
        const response = await apiDemande.get("offre/propositions/TI/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Vérifier si la réponse est au format attendu
        if (response.data && Array.isArray(response.data[0]?.results)) {
          const propositionsData = response.data[0].results.flat(); // Aplatir le tableau de propositions
          const sortedPropositions = propositionsData.sort(
            (a, b) => new Date(b.date_envoie) - new Date(a.date_envoie)
          );
          setPropositions(sortedPropositions);
        } else {
          console.error("❌ Format de réponse inattendu");
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des propositions :", error);
      }
      setLoading(false);
    };

    fetchPropositions();
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
          rows={propositions}
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

export default DemandeL;