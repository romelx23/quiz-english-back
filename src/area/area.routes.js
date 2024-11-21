const { Router } = require('express')
// const { check } = require('express-validator')
// const { validarJWT, validarCampos, tieneRole } = require('../middlewares')
// const {
//   createArea,
//   getAreas,
//   getArea,
//   updateArea,
//   deleteArea
// } = require('./area.controller')
// const { existeAreaPorId } = require('../helpers/db-validators')
const router = Router()

// // Obtener todas las cateogrias - publico
// router.get('/', getAreas)

// // Obtener una cateogria por id - publico
// router.get('/:id', [
//   check('id', 'No es un mongo ID').isMongoId(),
//   check('id').custom(existeAreaPorId),
//   validarCampos
// ], getArea)

// // Crear categoria -privado -cualquiera persona con token valido
// router.post(
//   '/',
//   [
//     validarJWT,
//     check('name', 'El nombre es obligatorio').not().isEmpty(),
//     validarCampos
//   ],
//   createArea
// )

// // Actulaizar po id - privado-con token valido
// router.put('/:id', [
//   validarJWT,
//   tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
//   check('name', 'El nombre es obligatorio').not().isEmpty(),
//   check('id', 'No es un mongo ID').isMongoId(),
//   check('id').custom(existeAreaPorId),
//   validarCampos
// ], updateArea)

// // borrar cateogira-admin
// router.delete('/:id', [
//   validarJWT,
//   tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
//   check('id').custom(existeAreaPorId),
//   check('id', 'No es un mongo ID').isMongoId(),
//   validarCampos
// ], deleteArea)

module.exports = router
