const { request, response } = require('express')
const Services = require('../services/services.model')
// const Incident = require('../incident/incident.model')

const createService = async (req = request, res = response) => {
  try {
    const name = req.body.name.toUpperCase()

    const serviceDB = await Services.findOne({ name })

    if (serviceDB) {
      return res.status(400).json({
        msg: `El Servicio ${serviceDB.name}, ya existe`
      })
    }
    // generar la dataa guardar
    const data = {
      name
    }

    const service = new Services(data)

    // GuardarDB
    await service.save()

    return res.status(201).json(
      {
        ok: true,
        msg: 'Service creado',
        service
      }
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Obtener Services - paginados - total - populate

const getServices = async (req = request, res = response) => {
  try {
    const { limit = 5, offset = 0, search = '' } = req.query
    const query = { status: true }
    console.log(query)
    if (search && search !== 'null' && search !== 'undefined') {
      console.log(search)
      query.name = { $regex: search, $options: 'i' }
    }
    const [total, services] = await Promise.all([
      Services.countDocuments(query),
      Services.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
    ])

    return res.status(200).json({
      ok: true,
      total,
      services
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Obtener Service populate{} por id

const getService = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const service = await Services.findById(id)

    if (!service.status) {
      return res.status(401).json({
        ok: false,
        msg: 'Service no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      service
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Actualizar Service

const updateService = async (req = request, res = response) => {
  try {
    // capturando query params
    const { id } = req.params

  const { estado, usuario, ...data } = req.body; //eslint-disable-line

    data.name = data.name.toUpperCase()
    const { name } = data
    data.usuario = req.usuario._id

    const serviceDB = await Services.findOne({ name })

    if (serviceDB) {
      return res.status(400).json({
        msg: `La Service ${serviceDB.name}, ya existe`
      })
    }

    const service = await Services.findByIdAndUpdate(
      id,
      data,
      { new: true }
  ); //eslint-disable-line

    if (!service.estado) {
      return res.status(401).json({
        msg: 'Service no encontrada',
        service
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'put API - servicePut',
      service
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Borrar Service estado :false

const deleteService = async (req = request, res = response) => {
  try {
    const { id } = req.params

    // const associatedIncidents = await Incident.find({ service: id })

    // if (associatedIncidents.length > 0) {
    //   return res.status(400).json({
    //     ok: false,
    //     msg: 'Service cannot be deleted. It is associated with incidents.'
    //   })
    // }

    const service = await Services.deleteOne({
      _id:
      id
    })

    if (!service) {
      return res.status(401).json({
        msg: 'servicio no encontrada'
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
  createService,
  getServices,
  getService,
  updateService,
  deleteService
}
