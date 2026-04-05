import {UploadChangeParam} from 'antd/lib/upload'
import {UploadFile} from 'antd/lib/upload/interface'
import forge from 'node-forge'
import convertBase64 from './convertBase64'

const handleCertUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
  if (info.file.status !== 'uploading') {
    if (info.fileList.length > 0) {
      const certFile = info.fileList[0].originFileObj as File
      if (certFile) {
        const certString = (await convertBase64(certFile)) as string
        const cerKey = forge.util.decode64(certString)
        const asnObj = forge.asn1.fromDer(cerKey)
        const pem = forge.pki.certificateFromAsn1(asnObj)
      }
    }
  }
}

export default handleCertUpload
