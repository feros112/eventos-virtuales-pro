export type TranslationType = {
    [key: string]: {
        [key: string]: any
    }
}

export const translations = {
    es: {
        auth: {
            signInTitle: "ACCESO",
            welcomeTitle: "BIENVENIDO",
            welcomeSubtitle: "A VIRTUAL",
            welcomeBody: "Únete a la experiencia inmersiva definitiva. Crea tu cuenta para acceder a eventos exclusivos.",
            emailLabel: "CORREO ELECTRÓNICO",
            passwordLabel: "CONTRASEÑA",
            createAccountBtn: "CREAR CUENTA",
            signInBtn: "ENTRAR",
            forgotPassword: "¿Olvidaste tu contraseña?",
            backToLogin: "VOLVER AL ACCESO",
            registrationTitle: "REGISTRO",
            accountCreds: "Credenciales de Cuenta",
            profileDetails: "Detalles del Perfil",
            completeRegBtn: "COMPLETAR REGISTRO",
            alreadyAccount: "¿Ya tienes cuenta?",
            namePlaceholder: "Nombre",
            lastNamePlaceholder: "Apellido",
            companyPlaceholder: "Empresa / Organización",
            confirmPassword: "Confirmar*",
            footer: {
                legal: "Aviso Legal",
                sitemap: "Mapa del Sitio",
                proEvents: "Eventos Pro"
            }
        },
        lobby: {
            enter: "ENTRAR",
            back: "VOLVER"
        }
    },
    en: {
        auth: {
            signInTitle: "SIGN IN",
            welcomeTitle: "WELCOME",
            welcomeSubtitle: "TO VIRTUAL",
            welcomeBody: "Join the ultimate immersive experience. Create your account to access exclusive events.",
            emailLabel: "EMAIL ADDRESS",
            passwordLabel: "PASSWORD",
            createAccountBtn: "CREATE ACCOUNT",
            signInBtn: "SIGN IN",
            forgotPassword: "Forgot Password?",
            backToLogin: "BACK TO LOGIN",
            registrationTitle: "REGISTRATION",
            accountCreds: "Account Credentials",
            profileDetails: "Profile Details",
            completeRegBtn: "COMPLETE REGISTRATION",
            alreadyAccount: "Already have an account?",
            namePlaceholder: "First Name",
            lastNamePlaceholder: "Last Name",
            companyPlaceholder: "Company / Organization",
            confirmPassword: "Confirm*",
            footer: {
                legal: "Legal Notice",
                sitemap: "Site Map",
                proEvents: "Pro Events"
            }
        },
        lobby: {
            enter: "ENTER",
            back: "BACK"
        }
    }
}
