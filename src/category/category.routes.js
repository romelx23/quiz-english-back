const { Router } = require('express')
// const { check } = require('express-validator')
// const { validarJWT, validarCampos, tieneRole } = require('../middlewares')
// const {
//   createCategory,
//   getCategories,
//   getCategory,
//   updateCategory,
//   deleteCategory
// } = require('./category.controller')
// const { existeCategoriaPorId } = require('../helpers/db-validators')
const router = Router()

// // Obtener todas las cateogrias - publico
// router.get('/', getCategories)

// // Obtener una cateogria por id - publico
// router.get('/:id', [
//   check('id', 'No es un mongo ID').isMongoId(),
//   check('id').custom(existeCategoriaPorId),
//   validarCampos
// ], getCategory)

// // Crear categoria -privado -cualquiera persona con token valido
// router.post(
//   '/',
//   [
//     validarJWT,
//     check('name', 'El nombre es obligatorio').not().isEmpty(),
//     validarCampos
//   ],
//   createCategory
// )

// // Actulaizar po id - privado-con token valido
// router.put('/:id', [
//   validarJWT,
//   tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
//   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
//   check('id', 'No es un mongo ID').isMongoId(),
//   check('id').custom(existeCategoriaPorId),
//   validarCampos
// ],
// updateCategory
// )

// // borrar cateogira-admin
// router.delete('/:id', [
//   validarJWT,
//   tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
//   // esAdminRole,
//   check('id').custom(existeCategoriaPorId),
//   check('id', 'No es un mongo ID').isMongoId(),
//   validarCampos
// ], deleteCategory)

module.exports = router
