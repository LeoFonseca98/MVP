import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET todas as transações
router.get("/transacoes", async (req, res) => {
  try {
    const transacoes = await prisma.transacao.findMany({
      include: {
        obra: true,
      },
      orderBy: {
        data: "desc",
      },
    });
    res.json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({ error: "Erro ao buscar transações" });
  }
});

// GET transações por obra
router.get("/obras/:obraId/transacoes", async (req, res) => {
  const { obraId } = req.params;

  try {
    const transacoes = await prisma.transacao.findMany({
      where: { obraId: parseInt(obraId) },
      orderBy: {
        data: "desc",
      },
    });
    res.json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({ error: "Erro ao buscar transações" });
  }
});

// POST criar nova transação
router.post("/transacoes", async (req, res) => {
  const { type, value, description, obraId } = req.body;

  if (!type || !value || !obraId) {
    return res.status(400).json({
      error: "Campos obrigatórios: type, value, obraId",
    });
  }

  try {
    const transacao = await prisma.transacao.create({
      data: {
        type,
        value: parseFloat(value),
        description: description ? description.trim() : null,
        obraId: parseInt(obraId),
      },
      include: {
        obra: true,
      },
    });
    res.status(201).json(transacao);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({ error: "Erro ao criar transação" });
  }
});

// PUT atualizar transação
router.put("/transacoes/:id", async (req, res) => {
  const { id } = req.params;
  const { type, value, description } = req.body;

  try {
    const transacao = await prisma.transacao.update({
        where: { id: parseInt(id) },
        data: {
            ...(type !== undefined && { type: String(type).trim() }),
            ...(value !== undefined && { value: parseFloat(value) }),
            ...(description !== undefined && {
            description: description ? description.trim() : null,
            }),
        },
        include: {
            obra: true,
        },
        });

    res.json(transacao);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    res.status(500).json({ error: "Erro ao atualizar transação" });
  }
});

// DELETE transação
router.delete("/transacoes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.transacao.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    res.status(500).json({ error: "Erro ao deletar transação" });
  }
});

export default router;