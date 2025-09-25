import express, { Request, Response } from 'express';
import Relatorio from '../models/relatorio';
import upload from '../config/multer';

const router = express.Router();

// Rota para CRIAR um novo relatório com upload de imagens
router.post('/', upload.fields([
    { name: 'entryImages', maxCount: 10 },
    { name: 'assistanceImages', maxCount: 10 },
    { name: 'qualityImages', maxCount: 10 }
]), async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const getFilePaths = (fieldName: string) => {
            return files[fieldName] ? files[fieldName].map(file => file.path) : [];
        };

        const entryImages = getFilePaths('entryImages');
        const assistanceImages = getFilePaths('assistanceImages');
        const qualityImages = getFilePaths('qualityImages');

        // Os dados do formulário (exceto os arquivos) virão como strings
        // Portanto, precisamos fazer o parse de alguns campos que são JSON ou outros tipos
        const body = req.body;
        const returnItems = body.returnItems ? JSON.parse(body.returnItems) : undefined;
        const customFields = body.customFields ? JSON.parse(body.customFields) : undefined;

        const novoRelatorio = await Relatorio.create({
            ...body,
            returnItems,
            customFields,
            entryImages: entryImages,
            assistanceImages: assistanceImages,
            qualityImages: qualityImages,
        });

        res.status(201).json(novoRelatorio);
    } catch (error) {
        console.error('Erro ao criar relatório:', error);
        res.status(400).json({ message: 'Erro ao criar relatório', error });
    }
});

// Rota para LER todos os relatórios
router.get('/', async (req: Request, res: Response) => {
    try {
        const relatorios = await Relatorio.findAll({
            order: [['startTime', 'DESC']]
        });
        res.status(200).json(relatorios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar relatórios', error });
    }
});

// Rota para LER um relatório específico por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id);
        if (relatorio) {
            res.status(200).json(relatorio);
        } else {
            res.status(404).json({ message: 'Relatório não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar relatório', error });
    }
});

// Rota para ATUALIZAR um relatório
router.put('/:id', upload.fields([
    { name: 'entryImages', maxCount: 10 },
    { name: 'assistanceImages', maxCount: 10 },
    { name: 'qualityImages', maxCount: 10 }
]), async (req: Request, res: Response) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id);
        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado' });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const body = req.body;

        const getUpdatedFilePaths = (fieldName: string, existingPathsStr: string) => {
            const newFiles = files[fieldName] ? files[fieldName].map(file => file.path) : [];
            const existingPaths = existingPathsStr ? JSON.parse(existingPathsStr) : [];
            return [...existingPaths, ...newFiles];
        };

        const entryImages = getUpdatedFilePaths('entryImages', body.entryImages);
        const assistanceImages = getUpdatedFilePaths('assistanceImages', body.assistanceImages);
        const qualityImages = getUpdatedFilePaths('qualityImages', body.qualityImages);

        // Parse de outros campos que podem ser JSON
        const returnItems = body.returnItems ? JSON.parse(body.returnItems) : relatorio.returnItems;
        const customFields = body.customFields ? JSON.parse(body.customFields) : relatorio.customFields;

        const updatedData = {
            ...body,
            returnItems,
            customFields,
            entryImages,
            assistanceImages,
            qualityImages,
        };

        const relatorioAtualizado = await relatorio.update(updatedData);
        res.status(200).json(relatorioAtualizado);

    } catch (error) {
        console.error("Erro ao atualizar relatório:", error);
        res.status(400).json({ message: 'Erro ao atualizar relatório', error });
    }
});

// Rota para DELETAR um relatório
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const relatorio = await Relatorio.findByPk(req.params.id);
        if (relatorio) {
            await relatorio.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Relatório não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar relatório', error });
    }
});

export default router;
