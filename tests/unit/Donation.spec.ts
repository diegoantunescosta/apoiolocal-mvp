import { describe, it, expect } from 'vitest';
import { Donation } from '../../src/domain/entities/Donation.js';
import { CollectionPoint } from '../../src/domain/entities/CollectionPoint.js';

describe('Donation & CollectionPoint Entities - Testes Unitários', () => {
  describe('Donation', () => {
    it('deve instanciar uma doação válida com status PENDENTE', () => {
      const donation = new Donation({
        demandId: 'dem_123',
        donorName: 'Maria Silva',
        donorPhone: '(11) 99999-1234',
        quantity: 10,
        notes: 'Entregarei na sexta à tarde'
      });

      expect(donation.id).toBeDefined();
      expect(donation.donorName).toBe('Maria Silva');
      expect(donation.quantity).toBe(10);
      expect(donation.status).toBe('PENDENTE');
    });

    it('deve permitir confirmar e cancelar doações', () => {
      const donation = new Donation({
        demandId: 'dem_123',
        donorName: 'João Santos',
        donorPhone: '(11) 98888-4321',
        quantity: 5
      });

      donation.confirm();
      expect(donation.status).toBe('CONFIRMADA');

      donation.cancel();
      expect(donation.status).toBe('CANCELADA');

      expect(() => donation.confirm()).toThrow(
        'Não é possível confirmar uma doação previamente cancelada.'
      );
    });

    it('deve validar dados obrigatórios na criação de doação', () => {
      expect(() => {
        new Donation({
          demandId: '',
          donorName: 'Carlos',
          donorPhone: '1199999999',
          quantity: 2
        });
      }).toThrow('A doação deve estar vinculada a uma demanda válida.');

      expect(() => {
        new Donation({
          demandId: 'dem_123',
          donorName: 'C',
          donorPhone: '1199999999',
          quantity: 2
        });
      }).toThrow('O nome do doador deve ter pelo menos 2 caracteres.');

      expect(() => {
        new Donation({
          demandId: 'dem_123',
          donorName: 'Carlos',
          donorPhone: '1199999999',
          quantity: 0
        });
      }).toThrow('A quantidade de itens a doar deve ser superior a zero.');
    });
  });

  describe('CollectionPoint', () => {
    it('deve instanciar um ponto de coleta com status ativo por padrão', () => {
      const point = new CollectionPoint({
        name: 'Igreja Matriz Comunitária',
        address: 'Rua das Flores, 120',
        neighborhood: 'Jardim Esperança',
        openingHours: 'Segunda a Sexta, das 08h às 17h',
        contactPhone: '(11) 3333-4444'
      });

      expect(point.id).toBeDefined();
      expect(point.active).toBe(true);
      expect(point.neighborhood).toBe('Jardim Esperança');
    });

    it('deve lançar erro se os campos obrigatórios forem inválidos', () => {
      expect(() => {
        new CollectionPoint({
          name: 'Pt',
          address: 'Rua das Flores, 120',
          neighborhood: 'Bairro',
          openingHours: '08h-18h',
          contactPhone: '1199999999'
        });
      }).toThrow('O nome do ponto de coleta deve conter ao menos 3 caracteres.');

      expect(() => {
        new CollectionPoint({
          name: 'Galpão Social',
          address: 'Rua',
          neighborhood: 'Bairro',
          openingHours: '08h-18h',
          contactPhone: '1199999999'
        });
      }).toThrow('O endereço completo do ponto de coleta é obrigatório.');
    });
  });
});
