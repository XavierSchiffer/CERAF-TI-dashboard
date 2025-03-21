import axios from "axios";

const API_ACCOUNT_URL = "http://127.0.0.1:8000/api/account";
const API_DEMANDE_URL = "http://127.0.0.1:8000/api/demande/";
const API_MODEM_URL = "http://127.0.0.1:8000/api/modem/";
const API_INTERVENTION_URL = "http://127.0.0.1:8000/api/intervention/";

// Création des instances Axios
export const apiAccount = axios.create({
    baseURL: API_ACCOUNT_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// export const apiFruit = axios.create({
//     baseURL: API_FRUIT_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

export const apiDemande = axios.create({
    baseURL: API_DEMANDE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const apiModem = axios.create({
    baseURL: API_MODEM_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const apiIntervention = axios.create({
    baseURL: API_INTERVENTION_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
