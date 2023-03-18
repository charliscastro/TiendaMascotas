import {Entity, model, property} from '@loopback/repository';

@model()
export class MenuRol extends Entity {
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
    required: true,
  })
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  rol: string;


  constructor(data?: Partial<MenuRol>) {
    super(data);
  }
}

export interface MenuRolRelations {
  // describe navigational properties here
}

export type MenuRolWithRelations = MenuRol & MenuRolRelations;
