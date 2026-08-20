/*
 * Service Worker do SITE da LaLabela Boutique (cliente).
 *
 * Duas funções:
 * 1) Permite usar registration.showNotification() nos avisos que disparam
 *    enquanto o site está aberto (mudança de status de pedido detectada
 *    em tempo real).
 * 2) Recebe e exibe as notificações push do Firebase Cloud Messaging
 *    quando o site está fechado/minimizado (enviadas pelo Worker via
 *    /notificar-cliente e /notificar-lancamento).
 *
 * Precisa estar hospedado em ./cliente-notificacoes-sw.js, na raiz do site.
 */

importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAqid6M2HB8_V0vWozjbZEInGpsNZ8IfKQ",
    authDomain: "lalabela-boutique.firebaseapp.com",
    projectId: "lalabela-boutique",
    storageBucket: "lalabela-boutique.firebasestorage.app",
    messagingSenderId: "642045507952",
    appId: "1:642045507952:web:8953c11428090b4a41b7b5"
});

const messaging = firebase.messaging();

// Dispara quando chega um push do FCM e o site NÃO está em primeiro
// plano (minimizado, aba fechada, ou app instalado fechado).
messaging.onBackgroundMessage((payload) => {
    const notif = payload.notification || {};
    const titulo = notif.title || "LaLabela Boutique";

    const opcoes = {
        body: notif.body || "",
        icon: notif.icon || "./LaLabela-icon-512-final.png",
        badge: "./LaLabela-icon-512-final.png",
        tag: notif.tag || "lalabela-cliente",
        data: payload.data || {}
    };

    self.registration.showNotification(titulo, opcoes);
});

// Ao tocar na notificação, abre o site (ou foca a aba já aberta).
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((listaJanelas) => {
            for (const janela of listaJanelas) {
                if ("focus" in janela) {
                    return janela.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("./");
            }
        })
    );
});

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});
