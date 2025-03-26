import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TopbarTI from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import TopbarU from "./scenes/global/TopbarU";
import SidebarU from "./scenes/global/SidebarU";
import Dashboard from "./scenes/dashboard";
import DashboardTI from "./scenes/dashboardTI";
import InterventionPage from "./scenes/intervention";
import Team from "./scenes/team";
import TeamTI from "./scenes/teamTech";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./scenes/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext"; // Correction ici
import DemandeL from "./scenes/demandeList";
import UserRegistrationForm from "./scenes/registrationU";
import Modem from "./scenes/modem";
import FormA from "./scenes/registrationAdmin";
import CreeDemande from "./scenes/creeDemande";
import DemandeLA from "./scenes/demandeListA";
import Proposition from "./scenes/proposition";
import UserProfile from "./scenes/UserProfil";
import EditProfileA from "./scenes/EditProfilA";
import EditPasswordA from "./scenes/EditePassA";
import EditProfileTI from "./scenes/EditProfilTI";
import EditPasswordTI from "./scenes/EditePassTI";
import TeamA from "./scenes/teamA";
import InterventionList from "./scenes/listI";
import InterventionDetails from "./scenes/interventionDetail";
import TechnicianDetails from "./scenes/techsDetail";
import AdminDetails from "./scenes/adminDetail";
import AbonneDetails from "./scenes/abonneDetail";
import InterventionListA from "./scenes/interventionLA";
import InterventionDetailsA from "./scenes/interventionDetailA";
import EditInterventionA from "./scenes/editeIntervention";
import DemandeEnCours from "./scenes/demandeEnCours";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { user } = useAuth(); // user est récupéré du contexte

    // Redirection automatique selon le rôle après connexion
    useEffect(() => {
      if (user && location.pathname === "/") {
        if (user.role === "TI") {
          window.location.href = "/dashboardTI"; // Redirige admin
        } else {
          window.location.href = "/dashboard"; // Redirige utilisateur
        }
      }
    }, [user, location.pathname]);
  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Gestion dynamique du Sidebar et du Topbar */}
          {!isLoginPage && (
              <>
                {user?.role === "TI" ? <SidebarU /> : <Sidebar />}
              </>
            )}
            <main className="content">
            {!isLoginPage && (
                <>
                  {user?.role === "TI" ? <TopbarTI setIsSidebar={setIsSidebar} /> : <TopbarU setIsSidebar={setIsSidebar} />}
                </>
              )}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboardTI" element={<DashboardTI />} />
                  <Route path="/list-abonne" element={<Team />} />
                  <Route path="/list-tech" element={<TeamTI />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/formA" element={<FormA />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/cree-modem" element={<Modem />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                  
                  <Route path="/proposition-list" element={<DemandeL />} />
                  <Route path="/intervention/:idDemande" element={<InterventionPage />} />
                  <Route path="/interventions/details/:id" element={<InterventionDetails />} />
                  <Route path="/interventions/detailsA/:id" element={<InterventionDetailsA />} />
                  <Route path="/techs/details/:id" element={<TechnicianDetails />} />
                  <Route path="/teamA/admins/details/:id" element={<AdminDetails />} />
                  <Route path="/proposition/:idDemande" element={<Proposition />} />
                  <Route path="/interventions/editA/:id" element={<EditInterventionA />} />
                  <Route path="/add-users" element={<UserRegistrationForm />} />
                  <Route path="/cree-demande" element={<CreeDemande />} />
                  <Route path="/liste-demande" element={<DemandeLA />} />
                  <Route path="/demande-list-en-cours" element={<DemandeEnCours />} />
                  <Route path="/profil" element={<UserProfile />} />
                  <Route path="/edit-profileA" element={<EditProfileA />} />
                  <Route path="/edit-profileTI" element={<EditProfileTI />} />
                  <Route path="/edit-passwordA" element={<EditPasswordA />} />
                  <Route path="/edit-passwordTI" element={<EditPasswordTI />} />
                  <Route path="/teamA" element={<TeamA />} />
                  <Route path="/intervention-list" element={<InterventionList />} />
                  <Route path="/intervention-listA" element={<InterventionListA />} />
                  <Route path="/abonnes/details/:id" element={<AbonneDetails />} />
                
                </Route>
              </Routes>
            </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
