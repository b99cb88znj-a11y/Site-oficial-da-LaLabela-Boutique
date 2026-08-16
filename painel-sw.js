// Service worker de notificações — LaLabela Boutique (painel administrativo)
//
// Esse arquivo precisa existir na RAIZ do painel, no mesmo nível do
// admin.html, com exatamente este nome: painel-sw.js

// ==========================================
// CAMADA 2 — PUSH EM SEGUNDO PLANO (FCM)
// Precisa vir ANTES de qualquer outra coisa no arquivo, porque o
// Service Worker precisa registrar o listener de push do Firebase assim
// que é carregado.
// ==========================================
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAqid6M2HB8_V0vWozjbZEInGpsNZ8IfKQ",
    authDomain: "lalabela-boutique.firebaseapp.com",
    projectId: "lalabela-boutique",
    storageBucket: "lalabela-boutique.firebasestorage.app",
    messagingSenderId: "642045507952",
    appId: "1:642045507952:web:8953c11428090b4a41b7b5"
});

const messaging = firebase.messaging();

// Chamado pelo Firebase quando chega um push com o painel FECHADO ou em
// segundo plano (é exatamente a Camada 2 que faltava).
messaging.onBackgroundMessage((payload) => {
    const titulo = (payload.notification && payload.notification.title) || "LaLabela Boutique";
    const opcoes = {
        body: (payload.notification && payload.notification.body) || "",
        icon: "./LaLabela-icon-512-final.png",
        badge: "./LaLabela-icon-512-final.png",
        tag: (payload.notification && payload.notification.tag) || "lalabela-push"
    };
    self.registration.showNotification(titulo, opcoes);
});


// ==========================================
// CAMADA 1 — já existia, sem alteração
// ==========================================
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Ao tocar na notificação, leva de volta para o painel.
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((listaJanelas) => {
            for (const janela of listaJanelas) {
                if ("focus" in janela) return janela.focus();
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow("./");
            }
        })
    );
});
