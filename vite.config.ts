import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

function demoOrdersApi(): Plugin {
  return {
    name: "demo-orders-api",
    configureServer(server) {
      server.middlewares.use("/api/orders", (request, response) => {
        if (request.method !== "POST") {
          response.statusCode = 405;
          response.end();
          return;
        }
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ reference: "NS-20481" }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), demoOrdersApi()],
});
