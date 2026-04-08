import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET todas as obras
router.get("/obras", async (req, res) => {
  try {
    const obras = await prisma.obra.findMany({
      include: {
        transacoes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(obras);
  } catch (error) {
    console.error("Erro ao buscar obras:", error);
    res.status(500).json({ error: "Erro ao buscar obras" });
  }
});

// POST criar nova obra
router.post("/obras", async (req, res) => {
  const { name, client, description, status } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Nome da obra é obrigatório" });
  }

  try {
    const obra = await prisma.obra.create({
      data: {
        name: name.trim(),
        client: client ? client.trim() : null,
        description: description ? description.trim() : null,
        status: status || "andamento",
      },
      include: {
        transacoes: true,
      },
    });
    res.status(201).json(obra);
  } catch (error) {
    console.error("Erro ao criar obra:", error);
    res.status(500).json({ error: "Erro ao criar obra" });
  }
});

// GET obra por ID
router.get("/obras/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const obra = await prisma.obra.findUnique({
      where: { id: parseInt(id) },
      include: {
        transacoes: true,
      },
    });

    if (!obra) {
      return res.status(404).json({ error: "Obra não encontrada" });
    }

    res.json(obra);
  } catch (error) {
    console.error("Erro ao buscar obra:", error);
    res.status(500).json({ error: "Erro ao buscar obra" });
  }
});

// PUT atualizar obra
router.put("/obras/:id", async (req, res) => {
  const { id } = req.params;
  const { name, client, description, status } = req.body;

  try {
    const obra = await prisma.obra.update({
      where: { id: parseInt(id) },
      data: {
        name: name ? name.trim() : undefined,
        client: client ? client.trim() : null,
        description: description ? description.trim() : null,
        status: status || undefined,
      },
      include: {
        transacoes: true,
      },
    });

    res.json(obra);
  } catch (error) {
    console.error("Erro ao atualizar obra:", error);
    res.status(500).json({ error: "Erro ao atualizar obra" });
  }
});

// DELETE obra
router.delete("/obras/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.obra.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Obra deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar obra:", error);
    res.status(500).json({ error: "Erro ao deletar obra" });
  }
});

export default router;