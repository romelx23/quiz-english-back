const { Router } = require('express')
const { check } = require('express-validator')
const { validarJWT, validarCampos, tieneRole } = require('../middlewares')
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService
} = require('./services.controller')
const { existeServicesPorId } = require('../helpers/db-validators')
const router = Router()

// Obtener todas las cateogrias - publico
router.get('/', getServices)

// Obtener una cateogria por id - publico
router.get('/:id', [
  check('id', 'No es un mongo ID').isMongoId(),
  check('id').custom(existeServicesPorId),
  validarCampos
], getService)

// Crear categoria -privado -cualquiera persona con token valido
router.post(
  '/',
  [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
  ],
  createService
)

// Actulaizar po id - privado-con token valido
router.put('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un mongo ID').isMongoId(),
  check('id').custom(existeServicesPorId),
  validarCampos
],
updateService
)

// borrar cateogira-admin
router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
  check('id').custom(existeServicesPorId),
  check('id', 'No es un mongo ID').isMongoId(),
  validarCampos
], deleteService)

module.exports = router
