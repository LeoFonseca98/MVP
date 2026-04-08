import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export async function criarObra(req: Request, res: Response) {
  try {
    const { name, client, description } = req.body;

    if (!name || !client) {
      return res.status(400).json({ error: "Nome e cliente são obrigatórios" });
    }

    const obra = await prisma.obra.create({
      data: {
        name,
        client,
        description,
        status: "andamento"
      }
    });

    return res.status(201).json(obra);

  } catch (error) {
    console.error("Erro ao criar obra:", error);
    return res.status(500).json({ error: "Erro ao criar obra" });
  }
}


//read (list all obras)
export async function listarObras(req: Request, res: Response) {
  try {
    const obras = await prisma.obra.findMany();
    return res.json(obras);
  } catch (error) {
    console.error("Erro ao listar obras:", error);
    return res.status(500).json({ error: "Erro ao listar obras" });
  }
}

//read (get obras by id)
export async function obterObraPorId(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))){
      return res.status(400).json({ error: "ID inválido!" });
    }

    const obra = await prisma.obra.findUnique({
      where: { id: Number(id)}
    });

    if (!obra){
      return res.status(404).json({ error: "Obra não encontrada!"});
    }

      return res.json(obra);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter obra por ID"});
    }
  }



//update
export async function atualizarObra(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, client, description, status } = req.body

    // verificar se a obra existe
    const obraExiste = await prisma.obra.findUnique({
      where: { id: Number(id) }
    });

    if (!obraExiste) {
      return res.status(404).json({ error: "Obra não encontrada!" });
    }


    const obraAtualizada = await prisma.obra.update({
      where: { id: Number(id) },
      data: { name, client, description, status }
    });

    return res.json(obraAtualizada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar obra" });
  }
}


//delete
export async function deletarObra(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // verificar se a obra existe
    const obraExiste = await prisma.obra.findUnique({
      where: { id: Number(id) }
    });

    if (!obraExiste) {
      return res.status(404).json({ error: "Obra não encontrada!" });
    }

    await prisma.obra.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Obra deletada com sucesso!"})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar obra"});
  }
}
