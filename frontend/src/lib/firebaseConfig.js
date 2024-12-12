import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración de tu proyecto Firebase
export const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account',
    display: 'popup'
});

const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
    prompt: 'consent'
});

export const auth = getAuth(app);
export { googleProvider, githubProvider };

// Inicializa Analytics solo si es compatible
let analytics = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
        console.log("Analytics inicializado");
    } else {
        console.warn("Analytics no es compatible con este entorno");
    }
});
