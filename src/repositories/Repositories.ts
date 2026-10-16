import { Demand, DemandCategory, DemandStatus } from '../domain/entities/Demand.js';
import { Donation } from '../domain/entities/Donation.js';
import { CollectionPoint } from '../domain/entities/CollectionPoint.js';

export interface IDemandRepository {
  create(demand: Demand): Promise<Demand>;
  findById(id: string): Promise<Demand | null>;
  findAll(filters?: { category?: DemandCategory; status?: DemandStatus; urgentOnly?: boolean }): Promise<Demand[]>;
  update(demand: Demand): Promise<Demand>;
}

export interface IDonationRepository {
  create(donation: Donation): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  findByDemandId(demandId: string): Promise<Donation[]>;
  update(donation: Donation): Promise<Donation>;
}

export interface ICollectionPointRepository {
  create(point: CollectionPoint): Promise<CollectionPoint>;
  findById(id: string): Promise<CollectionPoint | null>;
  findAll(): Promise<CollectionPoint[]>;
}

export class InMemoryDemandRepository implements IDemandRepository {
  private demands: Map<string, Demand> = new Map();

  constructor(initialData?: Demand[]) {
    if (initialData) {
      initialData.forEach(d => this.demands.set(d.id, d));
    }
  }

  async create(demand: Demand): Promise<Demand> {
    this.demands.set(demand.id, demand);
    return demand;
  }

  async findById(id: string): Promise<Demand | null> {
    return this.demands.get(id) || null;
  }

  async findAll(filters?: { category?: DemandCategory; status?: DemandStatus; urgentOnly?: boolean }): Promise<Demand[]> {
    let list = Array.from(this.demands.values());

    if (filters?.category) {
      list = list.filter(d => d.category === filters.category);
    }
    if (filters?.status) {
      list = list.filter(d => d.status === filters.status);
    }
    if (filters?.urgentOnly) {
      list = list.filter(d => d.urgent);
    }

    return list.sort((a, b) => {
      // Prioridade: urgentes primeiro, depois data de criação mais recente
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async update(demand: Demand): Promise<Demand> {
    this.demands.set(demand.id, demand);
    return demand;
  }

  clear(): void {
    this.demands.clear();
  }
}

export class InMemoryDonationRepository implements IDonationRepository {
  private donations: Map<string, Donation> = new Map();

  async create(donation: Donation): Promise<Donation> {
    this.donations.set(donation.id, donation);
    return donation;
  }

  async findById(id: string): Promise<Donation | null> {
    return this.donations.get(id) || null;
  }

  async findByDemandId(demandId: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(d => d.demandId === demandId);
  }

  async update(donation: Donation): Promise<Donation> {
    this.donations.set(donation.id, donation);
    return donation;
  }

  clear(): void {
    this.donations.clear();
  }
}

export class InMemoryCollectionPointRepository implements ICollectionPointRepository {
  private points: Map<string, CollectionPoint> = new Map();

  constructor(initialData?: CollectionPoint[]) {
    if (initialData) {
      initialData.forEach(p => this.points.set(p.id, p));
    }
  }

  async create(point: CollectionPoint): Promise<CollectionPoint> {
    this.points.set(point.id, point);
    return point;
  }

  async findById(id: string): Promise<CollectionPoint | null> {
    return this.points.get(id) || null;
  }

  async findAll(): Promise<CollectionPoint[]> {
    return Array.from(this.points.values()).filter(p => p.active);
  }

  clear(): void {
    this.points.clear();
  }
}
