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
      fallbackApk: "https://github.com/Nexx2131/Nexx-release/releases/latest/download/NEXX-Bot.apk"
    },
    farm: {
      name: "NEXX Farm",
      updateJson: "https://xarwmwksfakwuhrwexxh.supabase.co/storage/v1/object/public/nexx-releases/farm/update.json",
      apkBase: "https://xarwmwksfakwuhrwexxh.supabase.co/storage/v1/object/public/nexx-releases/farm/",
      fallbackApk: null // no fixed "latest" link for Farm yet; the page says so if the live read fails
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

  // SAMPLE coin packages. Prices are placeholders until the owner sets real ones.
  currency: "$",
  pricesAreSamples: true,
  packages: [
    { id: "p10",  coins: 10,  price: 5,  label: "Starter",  note: "10 days of NEXX Bot on one device" },
    { id: "p30",  coins: 30,  price: 12, label: "Month",    note: "A month of NEXX Bot, or 15 days of Farm", popular: true },
    { id: "p100", coins: 100, price: 35, label: "Pro",      note: "One day of Name change, or 25 days of Farm + donating" },
    { id: "p300", coins: 300, price: 90, label: "Reseller", note: "For running many devices" }
  ],

  // Payment choices shown in the (demo) checkout. Nothing is charged yet.
  payMethods: [
    { id: "card", label: "Card" },
    { id: "bank", label: "Bank transfer" },
    { id: "chat", label: "Pay the seller in chat" }
  ],

  support: {
    label: "Contact the seller",
    href: "#" // TODO: real support link (Discord, WhatsApp, Telegram…)
  },

  // Round icons at the bottom of every page. Put the full link between the quotes,
  // e.g. "https://www.instagram.com/NAME/", "https://t.me/GROUP", "https://discord.gg/CODE".
  // An icon shows only once its link is filled in.
  socials: [
    { id: "instagram", label: "Instagram", href: "" },
    { id: "telegram",  label: "Telegram",  href: "" },
    { id: "discord",   label: "Discord",   href: "" }
  ]
};
