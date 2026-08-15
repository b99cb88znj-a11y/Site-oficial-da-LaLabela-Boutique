// Service worker de notificações — LaLabela Boutique (painel administrativo)
//
// Esse arquivo precisa existir na RAIZ do painel, no mesmo nível do
// painel.html, com exatamente este nome: painel-sw.js
// Sem ele, o navegador nunca registra um service worker de verdade e as
// notificações de nova venda não chegam — mesmo com a permissão concedida.

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
