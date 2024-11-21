const { request, response } = require('express')
const Area = require('../area/area.model')
const { createAreaSchema } = require('./area.dto')

const createArea = async (req = request, res = response) => {
  try {
    // Validate the request body against the schema
    const { error } = createAreaSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        ok: false,
        errors: error.details.map((detail) => detail.message)
      })
    }

    console.log(req.user)
    const name = req.body.name.toUpperCase()

    const areaDb = await Area.findOne({ name })

    if (areaDb) {
      return res.status(400).json({
        msg: `La Area ${areaDb.name}, ya existe`
      })
    }
    // generar la dataa guardar
    const data = {
      name
      // usuario: req.usuario._id
    }

    const area = new Area(data)

    // GuardarDB
    await area.save()

    return res.status(201).json({
      ok: true,
      area
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Obtener Areas - paginados - total - populate

const getAreas = async (req = request, res = response) => {
  try {
    const { limit = 5, offset = 0, search = '' } = req.query
    const query = { status: true }

    if (search && search !== 'null' && search !== 'undefined') {
      query.name = { $regex: search, $options: 'i' }
    }

    console.log({ search })
    const [total, areas] = await Promise.all([
      Area.countDocuments(query),
      Area.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
    ])

    console.log({ total, areas })

    return res.status(200).json({
      ok: true,
      total,
      areas
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Obtener Area populate{} por id

const getArea = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const area = await Area.findById(id)
    console.log(area)

    if (!area.status) {
      return res.status(401).json({
        ok: false,
        msg: 'Area no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'get API - AreaGet',
      area
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Actualizar Area

const updateArea = async (req = request, res = response) => {
  try {
    // capturando query params
    const { id } = req.params

   const { status, ...data } = req.body; //eslint-disable-line

    data.name = data.name.toUpperCase()
    const { name } = data

    const areaDb = await Area.findOne({ name })

    if (areaDb) {
      return res.status(400).json({
        msg: `El Area ${areaDb.name}, ya existe`
      })
    }

    const area = await Area.findByIdAndUpdate(
      id,
      data,
      { new: true }
   ); //eslint-disable-line

    if (!area.status) {
      return res.status(401).json({
        msg: 'Area no encontrada',
        Area: area
      })
    }

    return res.status(200).json({
      msg: 'put API - AreaPut',
      Area: area
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Borrar Area estado :false

const deleteArea = async (req = request, res = response) => {
  try {
    const { id } = req.params

    // const area = await Area.deleteOne({
    //   _id:
    //   id
    // })
    const area = await Area.findOne({
      _id:
      id
    })
    console.log(area)
    // const area = await Area.findByIdAndUpdate(
    //   id,
    //   { status: false },
    //   { new: true }
    // )

    if (!area) {
      return res.status(401).json({
        msg: 'area no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'delete API - areaDelete'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  createArea,
  getAreas,
  getArea,
  updateArea,
  deleteArea
}
