import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Rol, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) {}

  /*
   * Add service methods here
   */
  generarClave() {
    const clave = generador(8, false);
    return clave;
  }

  cifrarClave(clave: String) {
    const claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  identificarUsuario(usuario: string, contrasena: string) {
    try {
      const p = this.usuarioRepository.findOne({
        where: {correo: usuario, contrasena: contrasena},
      });
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  generarTokenJWT(usuario: Usuario, rol: Rol) {
    const token = jwt.sign(
      {
        data: {
          id: usuario.id,
          correo: usuario.correo,
          nombre: usuario.nombres + ' ' + usuario.apellidos,
        },
        rol,
      },
      Llaves.claveJWT,
    );
    return token;
  }

  validarTokenJWT(token: string) {
    try {
      const datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
}
