# Minecraft Survival Bot

This project runs a Mineflayer bot for `play.normalsurvival.com`. It connects
as `tricartylarpbot`, logs in with `/login tricarty` one second after spawning,
logs connection and chat activity with timestamps, and retries the connection
10 seconds after an error or disconnect.

The bot intentionally does not move, jump, swing, or use any other anti-AFK
mechanic.

## Run on Replit

1. Open this project in Replit.
2. Dependencies are listed in `package.json`. If you are setting it up from a
   fresh checkout, run:

   ```bash
   pnpm install
   ```

3. Start the bot:

   ```bash
   pnpm start
   ```

   For development with automatic restarts after file changes, use:

   ```bash
   pnpm run dev
   ```

4. Replit supplies the HTTP port through `PORT`. The included Express server
   listens on that port and exposes:

   - `/` — JSON status summary
   - `/healthz` — health check for the running service

5. For continuous operation, run the project as an always-on Replit
   deployment/service rather than relying on a temporary development session.
   The HTTP server gives Replit a web service to monitor, while Mineflayer's
   reconnect logic restores the Minecraft connection after interruptions.

## Configuration

The Minecraft connection is configured in `index.js`:

```js
{
  host: "play.normalsurvival.com",
  port: 25565,
  username: "tricartylarpbot",
  version: "26.1"
}
```

To change the server or bot account, update `BOT_CONFIG` and
`LOGIN_COMMAND` in that file.

## Useful commands

```bash
pnpm start        # run the bot
pnpm run dev      # run with Node's watch mode
curl localhost:3000/healthz
```