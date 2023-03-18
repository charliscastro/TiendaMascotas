import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {MenuRol} from '../models';
import {MenuRolRepository} from '../repositories';

export class MenuRolController {
  constructor(
    @repository(MenuRolRepository)
    public menuRolRepository : MenuRolRepository,
  ) {}

  @post('/menu-rols')
  @response(200, {
    description: 'MenuRol model instance',
    content: {'application/json': {schema: getModelSchemaRef(MenuRol)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRol, {
            title: 'NewMenuRol',
            exclude: ['id'],
          }),
        },
      },
    })
    menuRol: Omit<MenuRol, 'id'>,
  ): Promise<MenuRol> {
    return this.menuRolRepository.create(menuRol);
  }

  @get('/menu-rols/count')
  @response(200, {
    description: 'MenuRol model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MenuRol) where?: Where<MenuRol>,
  ): Promise<Count> {
    return this.menuRolRepository.count(where);
  }

  @get('/menu-rols')
  @response(200, {
    description: 'Array of MenuRol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MenuRol, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MenuRol) filter?: Filter<MenuRol>,
  ): Promise<MenuRol[]> {
    return this.menuRolRepository.find(filter);
  }

  @patch('/menu-rols')
  @response(200, {
    description: 'MenuRol PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRol, {partial: true}),
        },
      },
    })
    menuRol: MenuRol,
    @param.where(MenuRol) where?: Where<MenuRol>,
  ): Promise<Count> {
    return this.menuRolRepository.updateAll(menuRol, where);
  }

  @get('/menu-rols/{id}')
  @response(200, {
    description: 'MenuRol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MenuRol, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MenuRol, {exclude: 'where'}) filter?: FilterExcludingWhere<MenuRol>
  ): Promise<MenuRol> {
    return this.menuRolRepository.findById(id, filter);
  }

  @patch('/menu-rols/{id}')
  @response(204, {
    description: 'MenuRol PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRol, {partial: true}),
        },
      },
    })
    menuRol: MenuRol,
  ): Promise<void> {
    await this.menuRolRepository.updateById(id, menuRol);
  }

  @put('/menu-rols/{id}')
  @response(204, {
    description: 'MenuRol PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() menuRol: MenuRol,
  ): Promise<void> {
    await this.menuRolRepository.replaceById(id, menuRol);
  }

  @del('/menu-rols/{id}')
  @response(204, {
    description: 'MenuRol DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.menuRolRepository.deleteById(id);
  }
}
