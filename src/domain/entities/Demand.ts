export type DemandCategory = 'ALIMENTOS' | 'HIGIENE' | 'ROUPAS' | 'OUTROS';
export type DemandStatus = 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export interface CreateDemandProps {
  id?: string;
  title: string;
  description: string;
  category: DemandCategory;
  targetQuantity: number;
  unit: string;
  beneficiaryEntity: string;
  contactPhone: string;
  urgent?: boolean;
  deadline?: Date;
  collectedQuantity?: number;
  status?: DemandStatus;
  createdAt?: Date;
}

export class Demand {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly category: DemandCategory;
  public readonly targetQuantity: number;
  public readonly unit: string;
  public readonly beneficiaryEntity: string;
  public readonly contactPhone: string;
  public readonly urgent: boolean;
  public readonly deadline?: Date;
  public collectedQuantity: number;
  public status: DemandStatus;
  public readonly createdAt: Date;

  constructor(props: CreateDemandProps) {
    this.validate(props);

    this.id = props.id || Demand.generateId();
    this.title = props.title.trim();
    this.description = props.description.trim();
    this.category = props.category;
    this.targetQuantity = props.targetQuantity;
    this.unit = props.unit.trim();
    this.beneficiaryEntity = props.beneficiaryEntity.trim();
    this.contactPhone = props.contactPhone.trim();
    this.urgent = props.urgent ?? false;
    this.deadline = props.deadline;
    this.collectedQuantity = props.collectedQuantity ?? 0;
    this.status = props.status ?? 'ABERTA';
    this.createdAt = props.createdAt ?? new Date();

    this.recalculateStatus();
  }

  private validate(props: CreateDemandProps): void {
    if (!props.title || props.title.trim().length < 3) {
      throw new Error('O título da demanda deve ter pelo menos 3 caracteres.');
    }
    if (!props.description || props.description.trim().length < 5) {
      throw new Error('A descrição deve ter pelo menos 5 caracteres informativos.');
    }
    if (!props.targetQuantity || props.targetQuantity <= 0) {
      throw new Error('A quantidade meta deve ser maior que zero.');
    }
    if (!props.unit || props.unit.trim().length === 0) {
      throw new Error('A unidade de medida (ex: kg, unidades, cestas) é obrigatória.');
    }
    if (!props.beneficiaryEntity || props.beneficiaryEntity.trim().length < 2) {
      throw new Error('A entidade ou grupo beneficiário deve ser identificado.');
    }
    if (!props.contactPhone || props.contactPhone.trim().length < 8) {
      throw new Error('Informe um telefone/WhatsApp de contato válido.');
    }
  }

  public registerDonation(amount: number): void {
    if (amount <= 0) {
      throw new Error('A quantidade doada deve ser estritamente positiva.');
    }
    if (this.status === 'CONCLUIDA') {
      throw new Error('Não é possível registrar doações para uma demanda já concluída.');
    }

    this.collectedQuantity += amount;
    this.recalculateStatus();
  }

  public calculateProgressPercentage(): number {
    if (this.targetQuantity === 0) return 100;
    const progress = (this.collectedQuantity / this.targetQuantity) * 100;
    return Math.min(100, Math.round(progress * 10) / 10);
  }

  public isExpired(currentDate: Date = new Date()): boolean {
    if (!this.deadline) return false;
    return currentDate.getTime() > this.deadline.getTime();
  }

  private recalculateStatus(): void {
    if (this.collectedQuantity >= this.targetQuantity) {
      this.status = 'CONCLUIDA';
    } else if (this.collectedQuantity > 0) {
      this.status = 'EM_ANDAMENTO';
    } else {
      this.status = 'ABERTA';
    }
  }

  private static generateId(): string {
    return 'dem_' + Math.random().toString(36).substring(2, 9);
  }
}
