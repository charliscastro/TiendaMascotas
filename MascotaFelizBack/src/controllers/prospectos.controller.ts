import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Prospectos, Rol, Usuario} from '../models';
import {
  ProspectosRepository,
  RolRepository,
  UsuarioRepository,
} from '../repositories';
const fetch = require('node-fetch');

export class ProspectosController {
  constructor(
    @repository(ProspectosRepository)
    public prospectosRepository: ProspectosRepository,
    @repository(RolRepository)
    public rolRepository: RolRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) {}

  @post('/prospectos')
  @response(200, {
    description: 'Prospectos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prospectos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospectos, {
            title: 'NewProspectos',
            exclude: ['id'],
          }),
        },
      },
    })
    prospectos: Omit<Prospectos, 'id'>,
  ): Promise<Prospectos> {
    const prospecto = await this.prospectosRepository.create(prospectos);

    const roles = await this.rolRepository.find();
    let rolUsuario: Rol = new Rol();

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < roles.length; index++) {
      const element = roles[index];
      // eslint-disable-next-line eqeqeq
      if (element.codigo == 'ADMIN') {
        rolUsuario = element;
      }
    }

    const filter: Filter<Usuario> = {
      where: {
        rolId: rolUsuario.id,
      },
      fields: {
        correo: true,
        nombres: true,
        apellidos: true,
      },
      offset: 0,
      limit: 10,
      skip: 0,
      order: [],
    };

    const users = await this.usuarioRepository.find(filter);

    if (users.length > 0) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let index = 0; index < users.length; index++) {
        const admin = users[index];

        //Notificar usuario
        const body = {
          to: admin.correo,
          subject: 'Nuevo Prospecto',
          text: `Hola <strong>${admin.nombres} ${admin.apellidos}</strong>, se ha registrado en la aplicación un nuevo prospecto:
            <br/>
            <strong>Nombre:</strong> ${prospecto.nombres}
            <br/>
            <strong>Correo:</strong> ${prospecto.correo}
            <br/>
            <strong>Mensaje:</strong> ${prospecto.mensaje} `,
        };

        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const responses = await fetch(
            `${Llaves.urlServicioNotificaciones}/mail`,
            {
              method: 'post',
              body: JSON.stringify(body),
              headers: {'Content-Type': 'application/json'},
            },
          );
          const data = await responses.json();

          console.log(data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    return prospecto;
  }

  @get('/prospectos/count')
  @response(200, {
    description: 'Prospectos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Prospectos) where?: Where<Prospectos>,
  ): Promise<Count> {
    return this.prospectosRepository.count(where);
  }

  @get('/prospectos')
  @response(200, {
    description: 'Array of Prospectos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prospectos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Prospectos) filter?: Filter<Prospectos>,
  ): Promise<Prospectos[]> {
    return this.prospectosRepository.find(filter);
  }

  @patch('/prospectos')
  @response(200, {
    description: 'Prospectos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospectos, {partial: true}),
        },
      },
    })
    prospectos: Prospectos,
    @param.where(Prospectos) where?: Where<Prospectos>,
  ): Promise<Count> {
    return this.prospectosRepository.updateAll(prospectos, where);
  }

  @get('/prospectos/{id}')
  @response(200, {
    description: 'Prospectos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prospectos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Prospectos, {exclude: 'where'})
    filter?: FilterExcludingWhere<Prospectos>,
  ): Promise<Prospectos> {
    return this.prospectosRepository.findById(id, filter);
  }

  @patch('/prospectos/{id}')
  @response(204, {
    description: 'Prospectos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prospectos, {partial: true}),
        },
      },
    })
    prospectos: Prospectos,
  ): Promise<void> {
    await this.prospectosRepository.updateById(id, prospectos);
  }

  @put('/prospectos/{id}')
  @response(204, {
    description: 'Prospectos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() prospectos: Prospectos,
  ): Promise<void> {
    await this.prospectosRepository.replaceById(id, prospectos);
  }

  @del('/prospectos/{id}')
  @response(204, {
    description: 'Prospectos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.prospectosRepository.deleteById(id);
  }
}
