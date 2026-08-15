// Service Worker exclusivo de notificações do site LaLabela — separado do
// sw.js já existente no projeto para não interferir em nada que ele já faça.
// Responsável por exibir as notificações de atualização de status do pedido
// (pagamento aprovado, saiu para entrega, etc.) na barra de notificações da cliente.

self.addEventListener("install", function (event) {
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});

// Ao tocar na notificação, foca ou abre o site (na aba de rastreio).
self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (listaClientes) {
            for (const cliente of listaClientes) {
                if ("focus" in cliente) {
                    return cliente.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow("./");
            }
        })
    );
});
