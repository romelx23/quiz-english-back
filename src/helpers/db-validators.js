const Area = require('../area/area.model')
const Categoria = require('../category/category.model')
const Rol = require('../rol/rol.models')
const Services = require('../services/services.model')
const Usuario = require('../user/user.model')

const esRoleValido = async (role = '') => {
  const existeRol = await Rol.findOne({ rol: role })

  if (!existeRol) {
    throw new Error(`El rol ${role} no esta registrado`)
  }
}

const esRoleValidoLocal = async (role = '') => {
  const roles = ['ADMIN_ROLE', 'MONITOR_ROLE', 'USER_ROLE']

  if (!roles.includes(role)) {
    throw new Error(`El rol ${role} no esta registrado`)
  }
}

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo })
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`)
  }
}

const existeUsuarioPorId = async (id) => {
  // Verificar si el usuario existe
  const existeUsuario = await Usuario.findById(id)
  if (!existeUsuario) {
    throw new Error(`El id: ${id} no esta registrado`)
  }
}

const existeCategoriaPorId = async (id) => {
  // Verificar si la categoria existe
  const existeCategoria = await Categoria.findById(id)
  if (!existeCategoria) {
    throw new Error(`El id: ${id} no esta registrado`)
  }
}

const existeServicesPorId = async (id) => {
  // Verificar si la categoria existe
  const existeServicio = await Services.findById(id)
  console.log(existeServicio)
  if (!existeServicio) {
    throw new Error(`El id: ${id} no esta registrado`)
  }
}

const existeAreaPorId = async (id) => {
  // Verificar si la categoria existe
  const existeArea = await Area.findById(id)
  if (!existeArea) {
    throw new Error(`El id: ${id} no esta registrado`)
  }
}

const existePointPorId = async (id) => {
  // Verificar si la categoria existe
  const existeArea = await Area.findById(id)
  if (!existeArea) {
    throw new Error(`El id: ${id} no esta registrado`)
  }
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion)
  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, ${colecciones}`
    )
  }
  return true
}

module.exports = {
  esRoleValido,
  esRoleValidoLocal,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeServicesPorId,
  existeAreaPorId,
  coleccionesPermitidas,
  existePointPorId
}
