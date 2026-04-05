function handleErrorMessage(errorMessage: string): {
  message: string
  duration: number
} {
  if (errorMessage.includes('is not active')) {
    return {
      message:
        'La suscripción no está activa, activa tu suscripción para poder actualizar la FIEL',
      duration: 7,
    }
  }

  switch (errorMessage) {
    case 'Invalid private key, maybe the passphrase is wrong':
      return {
        message:
          'Error al actualizar la FIEL, la contraseña de tu FIEL fue rechazada, verifica e intenta de nuevo',
        duration: 7,
      }
    case 'Certificate is not a FIEL':
      return {
        message:
          'Error al actualizar la FIEL, los archivos enviados, no corresponde a los de una FIEL, verifica que no sean de un certificado de facturación',
        duration: 7,
      }
    case 'Certificate is expired. Please upload a new one.':
      return {
        message:
          'Error al actualizar la FIEL, el certificado está expirado, verifica que la FIEL esté vigente.',
        duration: 7,
      }
    case 'Certificate is not yet valid. Please upload a new one.':
      return {
        message:
          'Error al actualizar la FIEL, el certificado aún no es válido, verifica que la FIEL esté vigente.',
        duration: 7,
      }
    default:
      return {
        message: 'Error al actualizar la FIEL',
        duration: 5,
      }
  }
}

export default handleErrorMessage
