import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Prospectos, ProspectosRelations} from '../models';

export class ProspectosRepository extends DefaultCrudRepository<
  Prospectos,
  typeof Prospectos.prototype.id,
  ProspectosRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Prospectos, dataSource);
  }
}
