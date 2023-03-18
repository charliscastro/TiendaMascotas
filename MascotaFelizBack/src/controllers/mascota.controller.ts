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
import {Mascota, Rol, Usuario} from '../models';
import {
  MascotaRepository,
  PlanRepository,
  RolRepository,
  UsuarioRepository,
} from '../repositories';
const fetch = require('node-fetch');

export class MascotaController {
  constructor(
    @repository(MascotaRepository)
    public mascotaRepository: MascotaRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(RolRepository)
    public rolRepository: RolRepository,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
  ) {}

  @post('/mascotas')
  @response(200, {
    description: 'Mascota model instance',
    content: {'application/json': {schema: getModelSchemaRef(Mascota)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascota, {
            title: 'NewMascota',
            exclude: ['id'],
          }),
        },
      },
    })
    mascota: Omit<Mascota, 'id'>,
  ): Promise<Mascota> {
    const mascotaCreate = await this.mascotaRepository.create(mascota);

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

    const cliente = await this.usuarioRepository.findById(mascota.usuarioId);
    const plan = await this.planRepository.findById(mascota.planId);

    if (users.length > 0) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let index = 0; index < users.length; index++) {
        const admin = users[index];

        //Notificar usuario
        const body = {
          to: admin.correo,
          subject: 'Nueva Solicitud Afiliación',
          text: `Hola ${admin.nombres} ${admin.apellidos}, un cliente ha realizado una solicitud de afiliación, estos son los datos:
            <br/>
            Nombre mascota: ${mascotaCreate.nombre}
            <br/>
            Cliente: ${cliente.nombres} ${cliente.apellidos}
            <br/>
            Cliente: ${plan.nombre}`,
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

    return mascotaCreate;
  }

  @get('/mascotas/count')
  @response(200, {
    description: 'Mascota model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Mascota) where?: Where<Mascota>): Promise<Count> {
    return this.mascotaRepository.count(where);
  }

  @get('/mascotas')
  @response(200, {
    description: 'Array of Mascota model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Mascota, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Mascota) filter?: Filter<Mascota>,
  ): Promise<Mascota[]> {
    return this.mascotaRepository.find(filter);
  }

  @patch('/mascotas')
  @response(200, {
    description: 'Mascota PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascota, {partial: true}),
        },
      },
    })
    mascota: Mascota,
    @param.where(Mascota) where?: Where<Mascota>,
  ): Promise<Count> {
    return this.mascotaRepository.updateAll(mascota, where);
  }

  @get('/mascotas/{id}')
  @response(200, {
    description: 'Mascota model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Mascota, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Mascota, {exclude: 'where'})
    filter?: FilterExcludingWhere<Mascota>,
  ): Promise<Mascota> {
    return this.mascotaRepository.findById(id, filter);
  }

  @patch('/mascotas/{id}')
  @response(204, {
    description: 'Mascota PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascota, {partial: true}),
        },
      },
    })
    mascota: Mascota,
  ): Promise<void> {
    await this.mascotaRepository.updateById(id, mascota);
  }

  @patch('/mascotas/estadoafiliacion/{id}')
  @response(204, {
    description: 'Mascota PATCH success',
  })
  async updateEstadoById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mascota, {partial: true}),
        },
      },
    })
    mascota: Mascota,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mascotaUpdate = await this.mascotaRepository.updateById(id, mascota);

    const mascotaFound = await this.mascotaRepository.findOne({
      where: {id: id},
    });

    const userFound = await this.usuarioRepository.findOne({
      where: {id: mascotaFound?.usuarioId},
    });
    if (userFound) {
      //Notificar usuario
      const body = {
        to: userFound.correo,
        subject: 'Respuesta Solicitud Afiliación',
        text: `Hola <strong>${userFound.nombres} ${userFound.apellidos}</strong>, su solicitud de afiliación fue respondida:
              <br>
              <strong>Estado:</strong> ${mascota.estado}
              <br>
              <strong>Fecha Afiliación:</strong> ${mascota.fechaAfiliacion}
              <br>
              <strong>Detalle:</strong> ${mascota.detalle}`,
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

  @put('/mascotas/{id}')
  @response(204, {
    description: 'Mascota PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() mascota: Mascota,
  ): Promise<void> {
    await this.mascotaRepository.replaceById(id, mascota);
  }

  @del('/mascotas/{id}')
  @response(204, {
    description: 'Mascota DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.mascotaRepository.deleteById(id);
  }
}
