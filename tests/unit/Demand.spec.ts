import { describe, it, expect } from 'vitest';
import { Demand } from '../../src/domain/entities/Demand.js';

describe('Demand Entity - Regras de Negócio e Testes Unitários', () => {
  it('deve instanciar uma demanda válida com status ABERTA e progresso 0%', () => {
    const demand = new Demand({
      title: 'Arroz e Feijão para Cozinha Solidária',
      description: 'Campanha de arrecadação para 50 famílias do bairro',
      category: 'ALIMENTOS',
      targetQuantity: 100,
      unit: 'kg',
      beneficiaryEntity: 'Cozinha Comunitária Esperança',
      contactPhone: '(11) 98765-4321',
      urgent: true
    });

    expect(demand.id).toBeDefined();
    expect(demand.title).toBe('Arroz e Feijão para Cozinha Solidária');
    expect(demand.status).toBe('ABERTA');
    expect(demand.collectedQuantity).toBe(0);
    expect(demand.calculateProgressPercentage()).toBe(0);
    expect(demand.urgent).toBe(true);
  });

  it('deve lançar erro se o título tiver menos de 3 caracteres', () => {
    expect(() => {
      new Demand({
        title: 'Oi',
        description: 'Descrição válida e completa',
        category: 'ALIMENTOS',
        targetQuantity: 10,
        unit: 'kg',
        beneficiaryEntity: 'Associação',
        contactPhone: '1199999999'
      });
    }).toThrow('O título da demanda deve ter pelo menos 3 caracteres.');
  });

  it('deve lançar erro se a quantidade meta for menor ou igual a zero', () => {
    expect(() => {
      new Demand({
        title: 'Cestas Básicas',
        description: 'Arrecadação mensal comunitária',
        category: 'ALIMENTOS',
        targetQuantity: 0,
        unit: 'unidades',
        beneficiaryEntity: 'ONG Viva',
        contactPhone: '1199999999'
      });
    }).toThrow('A quantidade meta deve ser maior que zero.');
  });

  it('deve atualizar o status para EM_ANDAMENTO e calcular progresso ao receber doação parcial', () => {
    const demand = new Demand({
      title: 'Kits de Higiene e Limpeza',
      description: 'Sabonetes, pastas de dente e água sanitária',
      category: 'HIGIENE',
      targetQuantity: 200,
      unit: 'kits',
      beneficiaryEntity: 'Lar dos Idosos',
      contactPhone: '11988887777'
    });

    demand.registerDonation(50);

    expect(demand.collectedQuantity).toBe(50);
    expect(demand.status).toBe('EM_ANDAMENTO');
    expect(demand.calculateProgressPercentage()).toBe(25);
  });

  it('deve atualizar o status para CONCLUIDA ao atingir a meta estipulada', () => {
    const demand = new Demand({
      title: 'Agasalhos e Cobertores',
      description: 'Campanha de inverno para moradores de rua',
      category: 'ROUPAS',
      targetQuantity: 80,
      unit: 'peças',
      beneficiaryEntity: 'Pastoral Comunitária',
      contactPhone: '11977776666'
    });

    demand.registerDonation(80);

    expect(demand.collectedQuantity).toBe(80);
    expect(demand.status).toBe('CONCLUIDA');
    expect(demand.calculateProgressPercentage()).toBe(100);
  });

  it('não deve ultrapassar 100% no percentual de progresso mesmo com excedente', () => {
    const demand = new Demand({
      title: 'Cadernos e Lápis',
      description: 'Volta às aulas das crianças',
      category: 'OUTROS',
      targetQuantity: 50,
      unit: 'unidades',
      beneficiaryEntity: 'Escola do Bairro',
      contactPhone: '11966665555'
    });

    demand.registerDonation(60);

    expect(demand.collectedQuantity).toBe(60);
    expect(demand.status).toBe('CONCLUIDA');
    expect(demand.calculateProgressPercentage()).toBe(100);
  });

  it('deve rejeitar registro de doações com quantidade negativa ou zero', () => {
    const demand = new Demand({
      title: 'Leite em Pó',
      description: 'Para o berçário comunitário',
      category: 'ALIMENTOS',
      targetQuantity: 40,
      unit: 'latas',
      beneficiaryEntity: 'Creche Feliz',
      contactPhone: '11955554444'
    });

    expect(() => demand.registerDonation(0)).toThrow('A quantidade doada deve ser estritamente positiva.');
    expect(() => demand.registerDonation(-5)).toThrow('A quantidade doada deve ser estritamente positiva.');
  });

  it('deve rejeitar nova doação se a demanda já estiver concluída', () => {
    const demand = new Demand({
      title: 'Fraldas Geriátricas',
      description: 'Doação para abrigo de acolhimento',
      category: 'HIGIENE',
      targetQuantity: 20,
      unit: 'pacotes',
      beneficiaryEntity: 'Abrigo Bom Samaritano',
      contactPhone: '11944443333'
    });

    demand.registerDonation(20);
    expect(demand.status).toBe('CONCLUIDA');

    expect(() => demand.registerDonation(5)).toThrow(
      'Não é possível registrar doações para uma demanda já concluída.'
    );
  });

  it('deve calcular corretamente a expiração de prazo (deadline)', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // Ontem
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Semana que vem

    const expiredDemand = new Demand({
      title: 'Ovos de Páscoa',
      description: 'Ação de páscoa para crianças carentes',
      category: 'ALIMENTOS',
      targetQuantity: 30,
      unit: 'unidades',
      beneficiaryEntity: 'Associação de Moradores',
      contactPhone: '11933332222',
      deadline: pastDate
    });

    const activeDemand = new Demand({
      title: 'Material de Limpeza',
      description: 'Limpeza do centro comunitário',
      category: 'HIGIENE',
      targetQuantity: 15,
      unit: 'kits',
      beneficiaryEntity: 'Associação de Moradores',
      contactPhone: '11933332222',
      deadline: futureDate
    });

    expect(expiredDemand.isExpired()).toBe(true);
    expect(activeDemand.isExpired()).toBe(false);
  });
});
