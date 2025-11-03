import { app } from "./app";
import { env } from "./config/env";

const startServer = async () => {
  const port = env.port;
  app.listen(port, () => {
    console.info(`🚀 API server running on port ${port}`);
  });
};

void startServer();

