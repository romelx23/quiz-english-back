const { Router } = require('express')
const { check } = require('express-validator')
const { validarJWT, validarCampos, tieneRole } = require('../middlewares')
const {
  createPoint,
  getPoints,
  getPoint,
  updatePoint,
  deletePoint
} = require('./points.controller')
const { existePointPorId } = require('../helpers/db-validators')
const router = Router()

// Obtener todas las cateogrias - publico
router.get('/', getPoints)

// Obtener una cateogria por id - publico
router.get('/:id', [
  check('id', 'No es un mongo ID').isMongoId(),
  check('id').custom(existePointPorId),
  validarCampos
], getPoint)

// Crear categoria -privado -cualquiera persona con token valido
router.post(
  '/',
  [
    validarJWT,
    check('points', 'Los points son obligatorios').not().isEmpty(),
    validarCampos
  ],
  createPoint
)

// Actulaizar po id - privado-con token valido
router.put('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un mongo ID').isMongoId(),
  check('id').custom(existePointPorId),
  validarCampos
], updatePoint)

// borrar cateogira-admin
router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
  check('id').custom(existePointPorId),
  check('id', 'No es un mongo ID').isMongoId(),
  validarCampos
], deletePoint)

module.exports = router
