import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApoioLocalService } from '../services/ApoioLocalService.js';
import {
  InMemoryDemandRepository,
  InMemoryDonationRepository,
  InMemoryCollectionPointRepository
} from '../repositories/Repositories.js';
import { Demand, CollectionPoint } from '../domain/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Servir frontend estático da pasta public
  const publicDir = path.resolve(__dirname, '../public');
  app.use(express.static(publicDir));

  // Instâncias padrão dos repositórios e serviços com dados de demonstração
  const initialDemands = [
    new Demand({
      id: 'dem_arroz01',
      title: 'Arroz e Feijão para Cozinha Solidária',
      description: 'Arrecadação urgente de arroz e feijão para abastecer as refeições semanais de 70 famílias do bairro.',
      category: 'ALIMENTOS',
      targetQuantity: 150,
      unit: 'kg',
      beneficiaryEntity: 'Cozinha Comunitária Esperança do Povo',
      contactPhone: '(11) 98765-4321',
      urgent: true,
      collectedQuantity: 65
    }),
    new Demand({
      id: 'dem_higiene02',
      title: 'Kits de Sabonete e Pasta de Dente',
      description: 'Campanha de acolhimento e higiene básica para mães solteiras e crianças.',
      category: 'HIGIENE',
      targetQuantity: 80,
      unit: 'kits',
      beneficiaryEntity: 'Centro de Acolhimento Mãe Gentil',
      contactPhone: '(11) 97654-3210',
      urgent: false,
      collectedQuantity: 80
    }),
    new Demand({
      id: 'dem_agasalho03',
      title: 'Cobertores e Agasalhos Infantis',
      description: 'Preparação para a frente fria de inverno. Precisamos de cobertores grossos e casacos tamanho 4 ao 12.',
      category: 'ROUPAS',
      targetQuantity: 50,
      unit: 'peças',
      beneficiaryEntity: 'Pastoral Comunitária São Francisco',
      contactPhone: '(11) 96543-2109',
      urgent: true,
      collectedQuantity: 12
    })
  ];

  const initialPoints = [
    new CollectionPoint({
      id: 'pt_sede01',
      name: 'Centro Cultural e Social do Bairro',
      address: 'Rua da Cidadania, 450',
      neighborhood: 'Jardim Primavera',
      openingHours: 'Segunda a Sexta, das 09h às 18h',
      contactPhone: '(11) 3456-7890'
    }),
    new CollectionPoint({
      id: 'pt_paroquia02',
      name: 'Salão Paroquial São José',
      address: 'Av. dos Trabalhadores, 1020',
      neighborhood: 'Vila Esperança',
      openingHours: 'Terça a Domingo, das 08h às 19h',
      contactPhone: '(11) 3456-1122'
    })
  ];

  const demandRepo = new InMemoryDemandRepository(initialDemands);
  const donationRepo = new InMemoryDonationRepository();
  const pointRepo = new InMemoryCollectionPointRepository(initialPoints);
  const service = new ApoioLocalService(demandRepo, donationRepo, pointRepo);

  // Healthcheck
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'apoiolocal-mvp',
      timestamp: new Date().toISOString()
    });
  });

  // Métricas Consolidadas da Comunidade
  app.get('/api/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await service.getCommunityMetrics();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  });

  // ---- Rotas de Demandas ----
  app.get('/api/demands', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, status, urgent } = req.query;
      const demands = await service.listDemands({
        category: category as any,
        status: status as any,
        urgentOnly: urgent === 'true'
      });
      res.json(demands);
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/demands/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const demand = await service.getDemandById(id);
      res.json(demand);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  app.post('/api/demands', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await service.createDemand(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ---- Rotas de Doações ----
  app.post('/api/donations', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.registerDonation(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/demands/:id/donations', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const donations = await service.listDonationsByDemand(id);
      res.json(donations);
    } catch (err) {
      next(err);
    }
  });

  // ---- Rotas de Pontos de Coleta ----
  app.get('/api/collection-points', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const points = await service.listCollectionPoints();
      res.json(points);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/collection-points', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const point = await service.registerCollectionPoint(req.body);
      res.status(201).json(point);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Middleware de erro genérico
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  });

  return { app, service, demandRepo, donationRepo, pointRepo };
}
