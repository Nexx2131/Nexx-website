// NEXX website — every link, version source and price lives here.
// Change things in this one file; the pages read from it.

window.NEXX = {
  // Where each app's public update file lives. The Downloads page reads it live
  // to show the current version and build the download link.
  releases: {
    bot: {
      name: "NEXX Bot",
      updateJson: "https://xarwmwksfakwuhrwexxh.supabase.co/storage/v1/object/public/nexx-releases/update.json",
      apkBase: "https://xarwmwksfakwuhrwexxh.supabase.co/storage/v1/object/public/nexx-releases/",
      // Used if the live read fails. GitHub always redirects this to the newest release.
      fallbackApk: "https://github.com/Nexx2131/Nexx-release/releases/latest/download/NEXX-Bot.apk",
      // Download page on a file host (the owner's, 2026-11-19): the Download APK button opens it in a new tab instead
      // of downloading from GitHub. Each new NEXX Bot version: upload it there and paste its new link here.
      // Leave "" to download straight from GitHub again.
      downloadPage: "https://master-file-uploader.lovable.app/share/0def2666-c94c-4a58-ac2e-08cc673c9a5a"
    },
    farm: {
      name: "NEXX Farm",
      updateJson: "https://xarwmwksfakwuhrwexxh.supabase.co/storage/v1/object/public/nexx-releases/farm/update.json",
      apkBase: "https://xarwmwksfakwuhrwexxh.supabase.co/storage/v1/object/public/nexx-releases/farm/",
      fallbackApk: null, // no fixed "latest" link for Farm yet; the page says so if the live read fails
      // A download page on a free file host (MediaFire, Google Drive, ...), starting with https://. When set, the
      // Download button opens that page in a new tab instead of taking the 17.7 MB APK from the NEXX server, so new
      // players' downloads use none of the server's data. Each new Farm version: upload it there too and paste its new
      // link here. Leave "" to download from the NEXX server as before.
      downloadPage: "https://master-file-uploader.lovable.app/share/6b594b24-8f80-43ec-b174-8a31904b6b2f"
    }
  },

  // What the apps charge while they run (set on the NEXX server; shown here for players).
  usage: [
    { app: "NEXX Bot", mode: "Request", coins: 1, per: "24 h on one device" },
    { app: "NEXX Bot", mode: "Run account", coins: 1, per: "24 h on one device" },
    { app: "NEXX Bot", mode: "Name change", coins: 100, per: "24 h on one device" },
    { app: "NEXX Farm", mode: "Farming", coins: 2, per: "24 h on one phone" },
    { app: "NEXX Farm", mode: "Farming + donating", coins: 4, per: "24 h on one phone" },
    // Wall upgrades add 5 (server Specials nexx_farm_walls / nexx_farm_donate_walls, NEXX Farm v2.59, 2026-11-16).
    { app: "NEXX Farm", mode: "Farming + walls", coins: 7, per: "24 h on one phone" },
    { app: "NEXX Farm", mode: "Farming + donating + walls", coins: 9, per: "24 h on one phone" }
  ],

  // Coin orders (the form on the Coins page). An order goes to the NEXX server (function nexx_orders,
  // F:\NEXX Admin\server\015_website_orders.sql); you approve or reject it in NEXX Admin → Orders.
  orders: {
    server: "https://xarwmwksfakwuhrwexxh.supabase.co",
    // The server's PUBLIC (publishable) key, the same one every NEXX app carries. It can only call the
    // server's public functions, which check everything themselves. Kept out of plain text as in the
    // apps (it is the key written backwards, in base64). NEVER put a secret or service_role key here.
    key: "T1VpdlN1UVVfZzdGdEZQa0hnN0NDWlZ3cTdGMXhtdl9lbGJhaHNpbGJ1cF9icw==",
    // The same words as the server's list (nexx.order_settings.pay_methods), or the order is refused.
    payMethods: ["Binance", "El Dorado", "UPI"],
    maxCoins: 10000,                  // as nexx.order_settings.max_coins
    quick: [10, 30, 100, 300, 1000],  // the quick-pick buttons under the slider
    start: 30,                        // coins picked when the page opens
    waitDays: 3,                      // as nexx.order_settings.wait_days
    // Where buyers DM their order number. An app with an empty link is left out of the form's "Where we can reach
    // you" and gets no DM button: put the Discord invite here and Discord appears by itself.
    // discord: empty on purpose (owner, 2026-11-20: "Footer icon only"). The Discord invite is only in `socials` below:
    // here it would add Discord to the form, and the success screen would say "DM @cocnexx from Discord".
    dm: { handle: "@cocnexx", telegram: "https://t.me/cocnexx", instagram: "https://ig.me/m/cocnexx", discord: "" }
  },

  support: {
    label: "Contact the seller",
    href: "#" // TODO: real support link (Discord, WhatsApp, Telegram…)
  },

  // Round icons at the bottom of every page. Put the full link between the quotes,
  // e.g. "https://www.instagram.com/NAME/", "https://t.me/GROUP", "https://discord.gg/CODE".
  // An icon shows only once its link is filled in.
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/cocnexx/" },
    { id: "telegram",  label: "Telegram",  href: "https://t.me/cocnexx" },
    { id: "discord",   label: "Discord",   href: "https://discord.gg/8x2JwvvvmQ" } // the NEXX server, live 2026-11-20
  ]
};
