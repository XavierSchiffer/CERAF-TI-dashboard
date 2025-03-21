import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import TopbarU from "./scenes/global/TopbarU";
import SidebarU from "./scenes/global/SidebarU";
import Dashboard from "./scenes/dashboard";
import InterventionPage from "./scenes/intervention";
import Team from "./scenes/team";
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
          window.location.href = "/dashboardU"; // Redirige admin
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
                  {user?.role === "TI" ? <Topbar setIsSidebar={setIsSidebar} /> : <TopbarU setIsSidebar={setIsSidebar} />}
                </>
              )}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                  
                  <Route path="/proposition-list" element={<DemandeL />} />
                  <Route path="/intervention/:idDemande" element={<InterventionPage />} />
                
                </Route>
              </Routes>
            </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
