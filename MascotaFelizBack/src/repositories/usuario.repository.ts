import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Mascota, Usuario, UsuarioRelations, Rol} from '../models';
import {MascotaRepository} from './mascota.repository';
import {RolRepository} from './rol.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {
  public readonly mascotas: HasManyRepositoryFactory<
    Mascota,
    typeof Usuario.prototype.id
  >;

  public readonly rol: BelongsToAccessor<Rol, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('MascotaRepository')
    protected mascotaRepositoryGetter: Getter<MascotaRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Usuario, dataSource);
    this.rol = this.createBelongsToAccessorFor('rol', rolRepositoryGetter,);
    this.registerInclusionResolver('rol', this.rol.inclusionResolver);
    this.mascotas = this.createHasManyRepositoryFactoryFor(
      'mascotas',
      mascotaRepositoryGetter,
    );
    this.registerInclusionResolver('mascotas', this.mascotas.inclusionResolver);
  }
}
