import {
  Demand,
  DemandCategory,
  DemandStatus,
  CreateDemandProps,
  Donation,
  CreateDonationProps,
  CollectionPoint,
  CreateCollectionPointProps
} from '../domain/index.js';
import {
  IDemandRepository,
  IDonationRepository,
  ICollectionPointRepository
} from '../repositories/Repositories.js';

export class ApoioLocalService {
  constructor(
    private demandRepo: IDemandRepository,
    private donationRepo: IDonationRepository,
    private pointRepo: ICollectionPointRepository
  ) {}

  // ---- Casos de Uso de Demandas ----

  async createDemand(input: CreateDemandProps): Promise<Demand> {
    const demand = new Demand(input);
    return this.demandRepo.create(demand);
  }

  async listDemands(filters?: { category?: DemandCategory; status?: DemandStatus; urgentOnly?: boolean }): Promise<Demand[]> {
    return this.demandRepo.findAll(filters);
  }

  async getDemandById(id: string): Promise<Demand> {
    const demand = await this.demandRepo.findById(id);
    if (!demand) {
      throw new Error(`Demanda com id '${id}' não encontrada.`);
    }
    return demand;
  }

  // ---- Casos de Uso de Doações ----

  async registerDonation(input: CreateDonationProps): Promise<{ donation: Donation; demand: Demand }> {
    const demand = await this.getDemandById(input.demandId);

    if (input.collectionPointId) {
      const point = await this.pointRepo.findById(input.collectionPointId);
      if (!point || !point.active) {
        throw new Error('Ponto de coleta selecionado é inválido ou está inativo.');
      }
    }

    // Cria a entidade da doação (valida campos)
    const donation = new Donation(input);

    // Aplica regra de negócio na demanda e atualiza seu status
    demand.registerDonation(donation.quantity);
    donation.confirm();

    await this.donationRepo.create(donation);
    await this.demandRepo.update(demand);

    return { donation, demand };
  }

  async listDonationsByDemand(demandId: string): Promise<Donation[]> {
    return this.donationRepo.findByDemandId(demandId);
  }

  // ---- Casos de Uso de Pontos de Coleta ----

  async registerCollectionPoint(input: CreateCollectionPointProps): Promise<CollectionPoint> {
    const point = new CollectionPoint(input);
    return this.pointRepo.create(point);
  }

  async listCollectionPoints(): Promise<CollectionPoint[]> {
    return this.pointRepo.findAll();
  }
}
