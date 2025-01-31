const { Router } = require('express')
const { check } = require('express-validator')
const { coleccionesPermitidas } = require('../helpers')
const { validarCampos, ValidateUploadFiles } = require('../middlewares')
const { cargarArchivos, actualizarImagen, mostrarImagen,actualizarImagenCloudinary } = require("./upload.controller");//eslint-disable-line
const router = Router()

router.post('/', ValidateUploadFiles, cargarArchivos)

router.put('/:coleccion/:id', [
  ValidateUploadFiles,
  check('id', 'No es un mongo ID').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
  check('id', 'No es un mongo ID').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen)

module.exports = router
