import express from "express";
import cors from "cors";
import obraRoutes from "./routes/obra.routes";
import transacaoRoutes from "./routes/transacao.routes";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'https://mvp-front-47ap.vercel.app',
      'https://mvp-front-47ap-git-main-leonardo-fonsecas-projects.vercel.app',
      'http://localhost:3000',
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(obraRoutes);
app.use(transacaoRoutes);

app.listen(5000, () => {
  console.log("🚀 Servidor rodando na porta 5000");
});