
import express, { Request, Response } from 'express';
import Image from '../models/image';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Rota para DELETAR uma imagem
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const image = await Image.findByPk(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Imagem não encontrada' });
        }

        // Deleta o arquivo do sistema de arquivos
        const filePath = path.resolve(image.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Deleta o registro do banco de dados
        await image.destroy();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar imagem', error });
    }
});

export default router;
