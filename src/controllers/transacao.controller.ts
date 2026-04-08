import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export async function criarTransacao( req: Request, res: Response ) {
    try {
        const { type, value, description, obraId } = req.body;

        if (!type || !value) {
            return res.status(400).json({error : "Os campos Tipo e Valor são obrigatórios!"})
        }

        const transacao = await prisma.transacao.create({
            data: {
                type,
                value,
                description,
                obraId
            }
            });

        return res.status(201).json(transacao);

    } catch (error) {
        console.error("Erro ao cadastrar transação:", error)
        return res.status(500).json({ error: "Erro ao cadastrar transação! "})
    }
}

export async function listarTransacoes(req: Request, res: Response)
{
    try {
        const transacoes = await prisma.transacao.findMany();
        return res.status(200).json(transacoes);
    } catch (error){
        console.log("Erro ao listar transações:", error);
        return res.status(500).json({ error: "Erro ao listar transações!"})
    }
};

