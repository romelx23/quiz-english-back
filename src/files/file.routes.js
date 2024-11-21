const { Router } = require('express')
const { validarCampos, tieneRole, validarJWT } = require('../middlewares')
const { deleteFile } = require('./file..controller')

const router = Router()
router.delete('/:id',
  [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'MONITOR_ROLE'),
    validarCampos
  ],
  deleteFile)

module.exports = router
