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
            back: "VOLVER",
            instructions: {
                title: "CONTROLES DE NAVEGACIÓN",
                desktop: "ESCRITORIO",
                mobile: "MÓVIL",
                look: "Mirar",
                move: "Moverse",
                click: "Interactuar",
                drag: "Arrastrar",
                pinch: "Zoom",
                tap: "Tocar",
                gotIt: "¡ENTENDIDO!"
            },
            rooms: {
                auditorium: "AUDITORIO",
                expo: "EXPO HALL",
                workshops: "TALLERES",
                networking: "NETWORKING"
            }
        },
        expo: {
            title: "SALA DE EXPOSICIÓN",
            visit: "VISITAR",
            backToLobby: "VOLVER AL LOBBY"
        },
        auditorium: {
            live: "EN VIVO",
            offline: "OFFLINE",
            raiseHand: "PEDIR LA PALABRA",
            handRaised: "TU MANO LEVANTADA",
            stageOnly: "Solo Escenario",
            toggleChat: "Chat",
            reactions: "Reacciones",
            poll: {
                title: "Encuesta Activa",
                vote: "Votar",
                voted: "¡Voto Registrado!",
                close: "Cerrar Encuesta",
                create: "Crear Encuesta",
                question: "Pregunta",
                options: "Opciones",
                publish: "Publicar"
            }
        },
        admin: {
            dashboard: "Tablero",
            users: "Usuarios",
            video: "Video y Stream",
            moderation: "Moderación",
            sponsors: "Patrocinadores",
            settings: "Configuración",
            analytics: "Analíticas",
            logout: "Cerrar Sesión",
            title: "Panel de Administración",
            welcome: "Bienvenido al Panel de Control",
            quickStats: "Estadísticas Rápidas"
        },
        videoAdmin: {
            title: "Gestión de Video",
            currentStream: "Stream Actual",
            streamUrl: "URL del Stream (HLS/M3U8)",
            streamTitle: "Título del Evento",
            isLive: "En Vivo",
            updateBtn: "Actualizar Stream",
            successUpdate: "Configuración actualizada correctamente"
        },
        moderation: {
            title: "Moderación en Vivo",
            handRaiseQueue: "Cola de Manos Levantadas",
            chatMonitor: "Monitor de Chat",
            clearQueue: "Limpiar Cola",
            noHands: "No hay manos levantadas",
            user: "Usuario",
            time: "Hora",
            action: "Acción",
            dismiss: "Descartar"
        },
        common: {
            save: "Guardar",
            cancel: "Cancelar",
            edit: "Editar",
            delete: "Eliminar",
            loading: "Cargando...",
            error: "Error",
            success: "Éxito"
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
            back: "BACK",
            instructions: {
                title: "NAVIGATION CONTROLS",
                desktop: "DESKTOP",
                mobile: "MOBILE",
                look: "Look Around",
                move: "Move",
                click: "Interact",
                drag: "Drag",
                pinch: "Zoom",
                tap: "Tap",
                gotIt: "GOT IT!"
            },
            rooms: {
                available: "AVAILABLE ROOMS",
                auditorium: "AUDITORIUM",
                expo: "EXPO HALL",
                workshops: "WORKSHOPS",
                networking: "NETWORKING"
            }
        },
        expo: {
            title: "EXPO HALL",
            visit: "VISIT",
            backToLobby: "BACK TO LOBBY"
        },
        auditorium: {
            live: "LIVE",
            offline: "OFFLINE",
            raiseHand: "RAISE HAND",
            handRaised: "HAND RAISED",
            stageOnly: "Stage Only",
            toggleChat: "Toggle Chat",
            reactions: "Reactions",
            poll: {
                title: "Active Poll",
                vote: "Vote",
                voted: "Vote Registered!",
                close: "Close Poll",
                create: "Create Poll",
                question: "Question",
                options: "Options",
                publish: "Publish"
            }
        },
        admin: {
            dashboard: "Dashboard",
            users: "Users",
            video: "Video & Stream",
            moderation: "Moderation",
            sponsors: "Sponsors",
            settings: "Settings",
            analytics: "Analytics",
            logout: "Logout",
            title: "Admin Panel",
            welcome: "Welcome to Control Panel",
            quickStats: "Quick Stats"
        },
        videoAdmin: {
            title: "Video Management",
            currentStream: "Current Stream",
            streamUrl: "Stream URL (HLS/M3U8)",
            streamTitle: "Event Title",
            isLive: "Is Live",
            updateBtn: "Update Stream",
            successUpdate: "Configuration updated successfully"
        },
        moderation: {
            title: "Live Moderation",
            handRaiseQueue: "Hand Raise Queue",
            chatMonitor: "Chat Monitor",
            clearQueue: "Clear Queue",
            noHands: "No hands raised",
            user: "User",
            time: "Time",
            action: "Action",
            dismiss: "Dismiss"
        },
        common: {
            save: "Save",
            cancel: "Cancel",
            edit: "Edit",
            delete: "Delete",
            loading: "Loading...",
            error: "Error",
            success: "Success"
        }
    }
}
