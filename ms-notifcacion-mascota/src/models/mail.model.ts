import {Model, model, property} from '@loopback/repository';

@model()
export class Mail extends Model {
  @property({
    type: 'string',
    required: false,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  text: string;

  constructor(data?: Partial<Mail>) {
    super(data);
  }
}

export interface MailRelations {
  // describe navigational properties here
}

export type MailWithRelations = Mail & MailRelations;
