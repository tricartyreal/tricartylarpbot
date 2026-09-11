const express = require("express");
const mineflayer = require("mineflayer");

const BOT_CONFIG = {
  host: "play.normalsurvival.com",
  port: 25565,
  username: "tricartylarpbot",
  version: "26.1",
};

const LOGIN_COMMAND = "/login tricarty";
const RECONNECT_DELAY_MS = 10_000;
const PORT = Number(process.env.PORT || 3000);

let bot = null;
let reconnectTimer = null;
let shuttingDown = false;

function log(event, message, ...details) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${event}] ${message}`, ...details);
}

function scheduleReconnect(reason) {
  if (shuttingDown || reconnectTimer) {
    return;
  }

  log("RECONNECT", `${reason}. Retrying in 10 seconds.`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectBot();
  }, RECONNECT_DELAY_MS);
}

function connectBot() {
  if (shuttingDown) {
    return;
  }

  log(
    "CONNECT",
    `Connecting to ${BOT_CONFIG.host}:${BOT_CONFIG.port} as ${BOT_CONFIG.username} (Minecraft ${BOT_CONFIG.version})`,
  );

  let currentBot;

  try {
    currentBot = mineflayer.createBot(BOT_CONFIG);
    bot = currentBot;
  } catch (error) {
    log("ERROR", "Could not create the Minecraft bot.", error);
    scheduleReconnect("Bot creation failed");
    return;
  }

  currentBot.once("login", () => {
    log("CONNECT", "Minecraft login handshake completed.");
  });

  currentBot.once("spawn", () => {
    log("SPAWN", "Bot spawned into the world.");

    setTimeout(() => {
      if (shuttingDown || bot !== currentBot || !currentBot.player) {
        return;
      }

      log("AUTH", "Sending the automatic login command.");
      currentBot.chat(LOGIN_COMMAND);
    }, 1_000);
  });

  currentBot.on("chat", (username, message) => {
    log("CHAT", `<${username}> ${message}`);
  });

  currentBot.on("kicked", (reason) => {
    log("KICKED", `The server kicked the bot: ${reason}`);
  });

  currentBot.on("error", (error) => {
    log("ERROR", "Minecraft bot error.", error);
    scheduleReconnect(`Connection error: ${error.message}`);
  });

  currentBot.on("end", (reason) => {
    if (bot === currentBot) {
      bot = null;
    }

    log("END", `Minecraft connection closed${reason ? `: ${reason}` : "."}`);
    scheduleReconnect("Minecraft connection ended");
  });
}

const app = express();

app.get("/", (_request, response) => {
  response.json({
    service: "minecraft-bot",
    status: bot?.player ? "online" : "connecting",
    server: `${BOT_CONFIG.host}:${BOT_CONFIG.port}`,
    username: BOT_CONFIG.username,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/healthz", (_request, response) => {
  response.status(200).json({
    ok: true,
    minecraft: bot?.player ? "online" : "reconnecting",
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  log("HTTP", `Keep-alive server listening on port ${PORT}.`);
  connectBot();
});

function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  log("SHUTDOWN", `Received ${signal}; closing services.`);

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (bot) {
    bot.quit(`Process received ${signal}`);
    bot = null;
  }

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));