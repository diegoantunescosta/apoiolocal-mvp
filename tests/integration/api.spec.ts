import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/server/app.js';

describe('API Endpoints - Testes Automatizados de Integração', () => {
  let app: any;

  beforeEach(() => {
    const instance = createApp();
    app = instance.app;
  });

  it('GET /api/health deve retornar status 200 e confirmação do serviço', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('apoiolocal-mvp');
  });

  it('GET /api/demands deve listar demandas cadastradas', async () => {
    const response = await request(app).get('/api/demands');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/demands deve criar uma nova demanda comunitária com sucesso', async () => {
    const payload = {
      title: 'Leite e Fórmulas Infantis',
      description: 'Campanha para apoiar mães da comunidade com bebês recém-nascidos.',
      category: 'ALIMENTOS',
      targetQuantity: 60,
      unit: 'latas',
      beneficiaryEntity: 'Coletivo Mães Guerreiras',
      contactPhone: '(11) 98888-7777',
      urgent: true
    };

    const response = await request(app)
      .post('/api/demands')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe(payload.title);
    expect(response.body.status).toBe('ABERTA');
    expect(response.body.collectedQuantity).toBe(0);
  });

  it('POST /api/demands deve retornar 400 se faltar campo obrigatório', async () => {
    const payload = {
      title: 'X', // Muito curto
      description: 'Desc',
      category: 'ALIMENTOS'
    };

    const response = await request(app)
      .post('/api/demands')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('POST /api/donations deve registrar intenção de doação e atualizar a demanda', async () => {
    // 1. Cria uma demanda
    const demandRes = await request(app)
      .post('/api/demands')
      .send({
        title: 'Cobertores para Abrigo',
        description: 'Doação de cobertores para noites frias.',
        category: 'ROUPAS',
        targetQuantity: 10,
        unit: 'peças',
        beneficiaryEntity: 'Abrigo Noturno',
        contactPhone: '(11) 91111-2222'
      });

    const demandId = demandRes.body.id;

    // 2. Registra doação parcial
    const donationRes = await request(app)
      .post('/api/donations')
      .send({
        demandId,
        donorName: 'Voluntário Anônimo',
        donorPhone: '(11) 99999-5555',
        quantity: 4
      });

    expect(donationRes.status).toBe(201);
    expect(donationRes.body.donation.status).toBe('CONFIRMADA');
    expect(donationRes.body.demand.collectedQuantity).toBe(4);
    expect(donationRes.body.demand.status).toBe('EM_ANDAMENTO');

    // 3. Registra doação completando a meta
    const completeRes = await request(app)
      .post('/api/donations')
      .send({
        demandId,
        donorName: 'Comércio Solidário',
        donorPhone: '(11) 97777-3333',
        quantity: 6
      });

    expect(completeRes.status).toBe(201);
    expect(completeRes.body.demand.collectedQuantity).toBe(10);
    expect(completeRes.body.demand.status).toBe('CONCLUIDA');
  });

  it('GET /api/collection-points deve retornar os pontos de coleta ativos', async () => {
    const response = await request(app).get('/api/collection-points');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].address).toBeDefined();
  });
});
