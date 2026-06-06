import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import analyzeHandler from "./api/analyze.js";

const httpsKeyPath = path.resolve("certs/dev-server.key");
const httpsCertPath = path.resolve("certs/dev-server.crt");
const useHttps = process.env.USE_HTTPS === "1";

function localApiPlugin() {
  return {
    name: "local-api-analyze",
    configureServer(server) {
      server.middlewares.use("/api/analyze", async (req, res) => {
        try {
          await analyzeHandler(req, res);
        } catch (error) {
          server.config.logger.error(error);
          res.statusCode = 500;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "本地 API 代理异常" }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["MIMO_API_KEY", "MIMO_BASE_URL", "MIMO_MODEL"]) {
    if (env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), localApiPlugin()],
    server: {
      port: 3000,
      https:
        useHttps && fs.existsSync(httpsKeyPath) && fs.existsSync(httpsCertPath)
          ? {
              key: fs.readFileSync(httpsKeyPath),
              cert: fs.readFileSync(httpsCertPath)
            }
          : undefined
    }
  };
});
