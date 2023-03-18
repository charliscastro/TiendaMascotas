import {service} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Credenciales, Rol, Usuario} from '../models';
import {RolRepository, UsuarioRepository} from '../repositories';
import {AutenticacionService} from '../services';
const fetch = require('node-fetch');

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(AutenticacionService)
    public authServices: AutenticacionService,
    @repository(RolRepository)
    public rolRepository: RolRepository,
  ) {}

  @post('/login', {
    responses: {
      '200': {
        description: 'Login Mascota Feliz',
      },
    },
  })
  async login(@requestBody() credenciales: Credenciales) {
    const p = await this.authServices.identificarUsuario(
      credenciales.usuario,
      credenciales.contrasena,
    );
    if (p) {
      const roles = await this.rolRepository.find();

      let rolUsuario: Rol = new Rol();

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let index = 0; index < roles.length; index++) {
        const element = roles[index];
        // eslint-disable-next-line eqeqeq
        if (element.id == p.rolId) {
          rolUsuario = element;
        }
      }

      const token = this.authServices.generarTokenJWT(p, rolUsuario);
      return {
        datos: {
          nombre: p.nombres + ' ' + p.apellidos,
          correo: p.correo,
          id: p.id,
        },
        rolUsuario,
        tk: token,
      };
    } else {
      throw new HttpErrors[401]('Datos no válidos');
    }
  }

  @post('/reset-password/{usuario}', {
    responses: {
      '200': {
        description: 'Restablecer la contraseña',
      },
    },
  })
  async resetPassword(@param.path.string('usuario') usuario: string) {
    const userFound = await this.usuarioRepository.findOne({
      where: {correo: usuario},
    });
    if (userFound) {
      const clave = this.authServices.generarClave();
      const claveCifrada = this.authServices.cifrarClave(clave);

      userFound.contrasena = claveCifrada;

      await this.usuarioRepository.updateById(userFound.id, userFound);

      //Notificar usuario
      const body = {
        to: userFound.correo,
        subject: 'Restablecer la contraseña',
        text: `Hola <strong>${userFound.nombres} ${userFound.apellidos}</strong>, estos son tus nuevos datos de ingreso:
              <br>
              <strong>Usuario:</strong> ${userFound.correo}
              <br>
              <strong>contraseña:</strong> ${clave}`,
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
    } else {
      throw new HttpErrors[404](
        'No se ha encontrado un Usuario con el correo ingreasado' + usuario,
      );
    }
  }

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id', 'contrasena'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    const filter: Filter<Usuario> = {
      where: {
        correo: usuario.correo,
      },
      fields: {
        id: true,
      },
      offset: 0,
      limit: 10,
      skip: 0,
      order: [],
    };

    const users = await this.usuarioRepository.find(filter);

    if (users.length > 0) {
      throw new HttpErrors[400](
        'Ya existe un usuario con el correo ingresado ' + usuario.correo,
      );
    }

    const clave = this.authServices.generarClave();
    const claveCifrada = this.authServices.cifrarClave(clave);

    usuario.contrasena = claveCifrada;

    const user = await this.usuarioRepository.create(usuario);

    //Notificar usuario
    const body = {
      to: user.correo,
      subject: 'Registro en la Plataforma',
      text: `Hola <strong>${user.nombres} ${user.apellidos}</strong>, estos son tus datos de ingreso:
            <br>
            <strong>Usuario:</strong> ${user.correo}
            <br>
            <strong>contraseña:</strong> ${clave}`,
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

    return user;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Usuario) where?: Where<Usuario>): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'})
    filter?: FilterExcludingWhere<Usuario>,
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
}
