import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Plan} from './plan.model';
import {Usuario} from './usuario.model';

@model()
export class Mascota extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: false,
  })
  foto: string;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    type: 'string',
    required: true,
  })
  raza: string;

  @property({
    type: 'string',
    required: true,
  })
  especie: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @property({
    type: 'string',
  })
  detalle?: string;

  @property({
    type: 'string',
  })
  fechaAfiliacion?: string;

  @belongsTo(() => Usuario, {name: 'usuario'})
  usuarioId: string;

  @belongsTo(() => Plan, {name: 'plan'})
  planId: string;

  constructor(data?: Partial<Mascota>) {
    super(data);
  }
}

export interface MascotaRelations {
  // describe navigational properties here
}

export type MascotaWithRelations = Mascota & MascotaRelations;
