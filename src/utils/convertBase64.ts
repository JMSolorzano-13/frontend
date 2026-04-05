function convertBase64(file: File) {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader()
    fReader.readAsDataURL(file)
    fReader.onload = () => {
      if (fReader.result) {
        resolve((fReader.result as string).split(',')[1])
      } else {
        reject(new Error('Error converting to string'))
      }
    }
    fReader.onerror = (err) => {
      reject(err)
    }
  })
}

export const convertSatFiles = async (cerFile: File, keyFile: File) => {
  try {
    const cerData = await convertBase64(cerFile)
    const keyData = await convertBase64(keyFile)
    return {
      cerData: cerData as string,
      keyData: keyData as string,
    }
  } catch (e) {
    throw new Error('Error al convertir los archivos')
  }
}

export default convertBase64
