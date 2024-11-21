const { response, request } = require('express')

const ValidateUploadFiles = (req = request, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.files) {
    // console.log('files', req.files)
    return res.status(400).json({
      ok: false,
      msg: 'No hay archivos que subir'
    })
  }
  next()
}

module.exports = {
  ValidateUploadFiles
}
