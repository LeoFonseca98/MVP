import express from "express";
import cors from "cors";
import obraRoutes from "./routes/obra.routes";
import transacaoRoutes from "./routes/transacao.routes";

const app = express();

app.use(cors({
  origin: "https://mvp-front-47ap-git-main-leonardo-fonsecas-projects.vercel.app"
}));

app.use(express.json());

app.use(obraRoutes);
app.use(transacaoRoutes);

app.listen(5000, () => {
  console.log("🚀 Servidor rodando na porta 5000");
});