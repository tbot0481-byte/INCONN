// plugins/_menu.js

const os = require("os");
const { Module, commands } = require("../lib/plugins");
const { getTheme } = require("../Themes/themes");
const theme = getTheme();
const config = require("../config");
const TextStyles = require("../lib/textfonts");
const styles = new TextStyles();

const name = "MINI INCONNU XD";

// Image unique pour tous les menus
const MENU_IMAGE = "https://i.postimg.cc/XvsZgKCb/IMG-20250731-WA0527.jpg";

const runtime = (secs) => {
  const pad = (s) => s.toString().padStart(2, "0");
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
};

const readMore = String.fromCharCode(8206).repeat(4001);

Module({
  command: "menu",
  package: "general",
  description: "Show all commands or a specific package",
})(async (message, match) => {
  try {
    await message.react("📜");
    
  const time = new Date().toLocaleTimeString("en-ZA", {
    timeZone: "Africa/Johannesburg",
  });
  const mode = config.WORK_TYPE || process.env.WORK_TYPE || "Public";
  const userName = message.pushName || "User";
  
  // RAM Info
  const totalMem = os.totalmem?.() || 0;
  const freeMem = os.freemem?.() || 0;
  const usedGB = ((totalMem - freeMem) / 1073741824).toFixed(2);
  const totGB = (totalMem / 1073741824).toFixed(2);
  const ram = `${usedGB} / ${totGB} GB`;

  // Group commands by package
  const grouped = commands
    .filter((cmd) => cmd.command && cmd.command !== "undefined")
    .reduce((acc, cmd) => {
      const pkg = String(cmd.package || "uncategorized").toLowerCase();
      if (!acc[pkg]) acc[pkg] = [];
      acc[pkg].push(cmd.command);
      return acc;
    }, {});

  const categories = Object.keys(grouped).sort();
  let _cmd_st = "";

  if (match && grouped[match.toLowerCase()]) {
    // Single package view
    const pack = match.toLowerCase();
    _cmd_st += `\n╭────❒ ${pack.toUpperCase()} ❒⁠⁠⁠⁠\n`;
    grouped[pack]
      .sort((a, b) => a.localeCompare(b))
      .forEach((cmdName) => {
        _cmd_st += `├◈ ${cmdName}\n`;
      });
    _cmd_st += `┕──────────────────❒\n`;
  } else {
    // Main menu header
    _cmd_st += `
╭─────────────⭓
│ 👤 User : ${userName}
│ ⏱ Runtime : ${runtime(process.uptime())}
│ 🕒 Time : ${time}
│ 💾 RAM : ${ram}
│ 🌐 Mode : ${mode}
│ ⚙️ Prefix : ${config.prefix}
│ 🤖 Bot : ${name}
╰──────────────⭓
${readMore}
`;

    if (match && !grouped[match.toLowerCase()]) {
      _cmd_st += `\n⚠️ *Package not found: ${match}*\n\n`;
      _cmd_st += `*Available Packages*:\n`;
      categories.forEach((cat) => {
        _cmd_st += `├◈ ${cat}\n`;
      });
    } else {
      // All categories
      for (const cat of categories) {
        const icon = grouped[cat].length > 5 ? "📁" : grouped[cat].length > 3 ? "📂" : "📌";
        _cmd_st += `\n╭─${icon} ${cat.toUpperCase()}\n`;
        
        grouped[cat]
          .sort((a, b) => a.localeCompare(b))
          .forEach((cmdName) => {
            _cmd_st += `│ • ${cmdName}\n`;
          });
        
        _cmd_st += `╰──────────────⭓\n`;
      }
    }

    _cmd_st += `\n✨ *Made with love by ${name}* ✨`;
  }

  const opts = {
    image: { url: MENU_IMAGE },
    caption: _cmd_st,
    mimetype: "image/jpeg",
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363403408693274@newsletter",
        newsletterName: config.BOT_NAME || name,
        serverMessageId: 6,
      },
    },
  };

  await message.conn.sendMessage(message.from, opts);
  } catch (err) {
    console.error("❌ Menu error:", err);
    await message.reply(`❌ Error: ${err?.message || err}`);
  }
});

Module({
  command: "list",
  package: "general",
  description: "List all available commands",
})(async (message) => {
  const aca = commands
    .filter((cmd) => cmd.command && cmd.command !== "undefined")
    .map((cmd) => cmd.command)
    .join("\n");
  await message.send(`*List:*\n${aca}`);
});

Module({
  command: "alive",
  package: "general",
  description: "Check if bot is alive",
})(async (message) => {
  const hostname = os.hostname();
  const time = new Date().toLocaleTimeString("en-ZA", {
    timeZone: "Africa/Johannesburg",
  });
  const ramUsedMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const ctx = `
╭─────────────⭓
│ 🤖 ${name}
│ ⏱ Uptime: ${hours}h ${minutes}m ${seconds}s
│ 🕒 Time: ${time}
│ 💾 RAM: ${ramUsedMB} MB
│ 💻 Host: ${hostname}
╰──────────────⭓
> ALIVE BOT ✅
`;

  await message.send({
    image: { url: MENU_IMAGE },
    caption: ctx,
  });
});
