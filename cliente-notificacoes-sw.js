// Service worker de notificações — LaLabela Boutique (site das clientes)
//
// Esse arquivo precisa existir na RAIZ do site, no mesmo nível do
// index.html, com exatamente este nome: cliente-notificacoes-sw.js
// Sem ele, o navegador nunca registra um service worker de verdade e as
// notificações de status do pedido não chegam — mesmo com a permissão
// concedida pela cliente.

self.addEventListener("install", () => {
    // Ativa este service worker imediatamente, sem esperar a aba fechar.
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Ao tocar na notificação, leva a cliente de volta para o site.
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
