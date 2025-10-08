import express, { Request, Response } from 'express';
import Relatorio from '../models/relatorio';
import Image from '../models/image';
import upload from '../config/multer';
import fs from 'fs';

const router = express.Router();

// Rota para CRIAR um novo relatório (apenas dados de texto)
router.post('/', async (req: Request, res: Response) => {
    try {
        const novoRelatorio = await Relatorio.create(req.body);
        res.status(201).json(novoRelatorio);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar relatório', error });
    }
});

// Rota para LER todos os relatórios (com imagens)
router.get('/', async (req: Request, res: Response) => {
    try {
        const relatorios = await Relatorio.findAll({
            include: [{ model: Image, as: 'images' }],
            order: [['startTime', 'DESC']]
        });
        res.status(200).json(relatorios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar relatórios', error });
    }
});

// Rota para LER um relatório específico por ID (com imagens)
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id, {
            include: [{ model: Image, as: 'images' }]
        });
        if (relatorio) {
            res.status(200).json(relatorio);
        } else {
            res.status(404).json({ message: 'Relatório não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar relatório', error });
    }
});

// Rota para ATUALIZAR um relatório (apenas dados de texto)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id);
        if (relatorio) {
            const relatorioAtualizado = await relatorio.update(req.body);
            res.status(200).json(relatorioAtualizado);
        } else {
            res.status(404).json({ message: 'Relatório não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar relatório', error });
    }
});

// Rota para DELETAR um relatório
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id, {
            include: [{ model: Image, as: 'images' }]
        });

        if (relatorio) {
            // Deleta as imagens associadas do sistema de arquivos
            if (relatorio.images && relatorio.images.length > 0) {
                relatorio.images.forEach(image => {
                    fs.unlink(image.path, (err) => {
                        if (err) {
                            // Tratar erro, talvez logar, mas não necessariamente parar o processo
                            console.error(`Erro ao deletar a imagem ${image.path}:`, err);
                        }
                    });
                });
            }

            // Deleta o relatório do banco de dados (e as imagens em cascata)
            await relatorio.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Relatório não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar relatório', error });
    }
});

// Rota para UPLOAD de uma imagem para um relatório
router.post('/:reportId/images', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;
        const { stage } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        const reportExists = await Relatorio.findByPk(reportId);
        if (!reportExists) {
            // Se o relatório não existe, apaga o arquivo que foi salvo
            fs.unlinkSync(file.path);
            return res.status(404).json({ message: 'Relatório não encontrado.' });
        }

        const newImage = await Image.create({
            reportId: parseInt(reportId, 10),
            path: file.path,
            stage: stage,
        });

        res.status(201).json(newImage);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao fazer upload da imagem', error });
    }
});

export default router;