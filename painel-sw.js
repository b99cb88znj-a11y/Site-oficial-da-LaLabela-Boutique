// Service Worker do Painel LaLabela — responsável por permitir que as
// notificações de "nova venda" apareçam na barra de notificações do
// celular/desktop mesmo com o navegador em segundo plano.

self.addEventListener("install", function (event) {
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});

// Ao tocar na notificação, foca ou abre o painel.
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
