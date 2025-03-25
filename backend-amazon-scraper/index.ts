import express from "express";

const app = express();
const port = 3000;

// Iniciando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
