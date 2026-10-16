export type DonationStatus = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';

export interface CreateDonationProps {
  id?: string;
  demandId: string;
  donorName: string;
  donorPhone: string;
  quantity: number;
  collectionPointId?: string;
  notes?: string;
  status?: DonationStatus;
  createdAt?: Date;
}

export class Donation {
  public readonly id: string;
  public readonly demandId: string;
  public readonly donorName: string;
  public readonly donorPhone: string;
  public readonly quantity: number;
  public readonly collectionPointId?: string;
  public readonly notes?: string;
  public status: DonationStatus;
  public readonly createdAt: Date;

  constructor(props: CreateDonationProps) {
    this.validate(props);

    this.id = props.id || Donation.generateId();
    this.demandId = props.demandId;
    this.donorName = props.donorName.trim();
    this.donorPhone = props.donorPhone.trim();
    this.quantity = props.quantity;
    this.collectionPointId = props.collectionPointId;
    this.notes = props.notes?.trim();
    this.status = props.status ?? 'PENDENTE';
    this.createdAt = props.createdAt ?? new Date();
  }

  private validate(props: CreateDonationProps): void {
    if (!props.demandId) {
      throw new Error('A doação deve estar vinculada a uma demanda válida.');
    }
    if (!props.donorName || props.donorName.trim().length < 2) {
      throw new Error('O nome do doador deve ter pelo menos 2 caracteres.');
    }
    if (!props.donorPhone || props.donorPhone.trim().length < 8) {
      throw new Error('O telefone do doador é obrigatório para coordenação da entrega.');
    }
    if (!props.quantity || props.quantity <= 0) {
      throw new Error('A quantidade de itens a doar deve ser superior a zero.');
    }
  }

  public confirm(): void {
    if (this.status === 'CANCELADA') {
      throw new Error('Não é possível confirmar uma doação previamente cancelada.');
    }
    this.status = 'CONFIRMADA';
  }

  public cancel(): void {
    this.status = 'CANCELADA';
  }

  private static generateId(): string {
    return 'don_' + Math.random().toString(36).substring(2, 9);
  }
}
