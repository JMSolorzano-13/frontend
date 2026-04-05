import {Rule} from 'antd/lib/form'
import {PasswordRegex, PhoneRegex} from './regexValues'

export const EMAIL_RULES: Rule[] = [
  {required: true, message: 'Correo faltante'},
  {type: 'email', message: 'Correo inválido'},
]

export const PHONE_RULES: Rule[] = [
  {required: true, message: 'Celular faltante'},
  {
    pattern: PhoneRegex,
    message: 'El celular debe de ser 10 dígitos sin espacios',
  },
]

export const PASSWORD_RULES: Rule[] = [
  {required: true, message: 'Contraseña faltante'},
  {min: 8, message: 'Mínimo 8 caracteres'},
  {max: 50, message: 'Máximo 50 caracteres'},
  {
    pattern: PasswordRegex,
    message:
      'La contraseña debe tener mayúsculas, números y un carácter especial: ! @ # & . " $ % / ( ) = ? ¿ ¡ * -',
  },
]

export const PASSWORD_CONFIRM_RULES: Rule[] = [
  {required: true, message: 'Confirmación faltante'},
  {min: 8, message: 'Mínimo 8 caracteres'},
  {max: 50, message: 'Máximo 50 caracteres'},
  {
    pattern: PasswordRegex,
    message:
      'La contraseña debe tener mayúsculas, números y un carácter especial: ! @ # & . " $ % / ( ) = ? ¿ ¡ * -',
  },
  ({getFieldValue}) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'))
    },
  }),
]
