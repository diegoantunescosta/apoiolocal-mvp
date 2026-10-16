export interface CreateCollectionPointProps {
  id?: string;
  name: string;
  address: string;
  neighborhood: string;
  openingHours: string;
  contactPhone: string;
  active?: boolean;
}

export class CollectionPoint {
  public readonly id: string;
  public readonly name: string;
  public readonly address: string;
  public readonly neighborhood: string;
  public readonly openingHours: string;
  public readonly contactPhone: string;
  public active: boolean;

  constructor(props: CreateCollectionPointProps) {
    this.validate(props);

    this.id = props.id || CollectionPoint.generateId();
    this.name = props.name.trim();
    this.address = props.address.trim();
    this.neighborhood = props.neighborhood.trim();
    this.openingHours = props.openingHours.trim();
    this.contactPhone = props.contactPhone.trim();
    this.active = props.active ?? true;
  }

  private validate(props: CreateCollectionPointProps): void {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error('O nome do ponto de coleta deve conter ao menos 3 caracteres.');
    }
    if (!props.address || props.address.trim().length < 5) {
      throw new Error('O endereço completo do ponto de coleta é obrigatório.');
    }
    if (!props.neighborhood || props.neighborhood.trim().length < 2) {
      throw new Error('O bairro do ponto de coleta deve ser informado.');
    }
    if (!props.openingHours || props.openingHours.trim().length < 3) {
      throw new Error('Informe o horário de funcionamento/recebimento de doações.');
    }
  }

  private static generateId(): string {
    return 'pt_' + Math.random().toString(36).substring(2, 9);
  }
}
