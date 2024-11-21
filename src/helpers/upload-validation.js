// validation type files
const ValidateUploadFiles = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|doc|csv|pdf|xlsx/

  const mimetype = file.mimetype

  const extname = file.originalname.split('.').pop()

  if (mimetype && fileTypes.test(mimetype) && fileTypes.test(extname)) {
    return cb(null, true)
  }

  return cb(new Error('Error: Archivo no soportado'), false)
}

const validateSizeFile = (file, cb) => {
  if (file.size > 5 * 1024 * 1024) {
    return cb(new Error('Error: Archivo excede el tamaño permitido'), false)
  }
  return cb(null, true)
}

module.exports = {
  ValidateUploadFiles,
  validateSizeFile
}
