import {Entity, model, property} from '@loopback/repository';

@model()
export class Prospectos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  nombres: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  constructor(data?: Partial<Prospectos>) {
    super(data);
  }
}

export interface ProspectosRelations {
  // describe navigational properties here
}

export type ProspectosWithRelations = Prospectos & ProspectosRelations;
