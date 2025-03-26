import app from "./app";
import { config } from "dotenv";

config();

const port = process.env.PORT || 3000;

// Inicia o servidor somente quando não estiver no ambiente de teste
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

export { app };
