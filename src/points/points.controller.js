const { request, response } = require('express')
const Points = require('../points/points.model')
const { createPointSchema } = require('./points.dto')

const createPoint = async (req = request, res = response) => {
  try {
    const user = req.user

    console.log({ user, body: user._id })
    // Validate the request body against the schema
    const { error } = createPointSchema.validate({
      ...req.body,
      user: user._id.toString()
    })

    if (error) {
      return res.status(400).json({
        ok: false,
        errors: error.details.map((detail) => detail.message)
      })
    }
    // si es el mismo usuario, que sume los puntos y lo actualice

    // if (user._id.toString() === req.body.user) {
    //   const pointsDb = await Points.find({
    //     user: user._id
    //   })

    //   if (pointsDb.length > 0) {
    //     const points = pointsDb[0]
    //     points.points += req.body.points
    //     await points.save()

    //     return res.status(201).json({
    //       ok: true,
    //       points
    //     })
    //   }
    // }

    // validate the same user from creating max 3 times a day

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const pointsDb = await Points.find({
      user: user._id,
      createdAt: { $gte: today, $lt: tomorrow }
    })

    if (pointsDb.length >= 3) {
      return res.status(400).json({
        ok: false,
        msg: 'No puedes crear mas de 3 puntos por dia'
      })
    }

    // generar la data guardar
    const data = {
      ...req.body,
      user: user._id
    }

    const points = new Points(data)

    // GuardarDB
    await points.save()

    return res.status(201).json({
      ok: true,
      points
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Obtener Points - paginados - total - populate

// const getPoints = async (req = request, res = response) => {
//   try {
//     const { limit = 15, offset = 0, search = '' } = req.query
//     const query = { status: true }

//     if (search && search !== 'null' && search !== 'undefined') {
//       query.name = { $regex: search, $options: 'i' }
//     }

//     console.log({ search })
//     const [total, points] = await Promise.all([
//       Points.countDocuments(query),
//       Points.find(query)
//         .skip(Number(offset))
//         .limit(Number(limit))
//         .populate('user', 'name')
//     ])

//     console.log({ total, points })

//     return res.status(200).json({
//       ok: true,
//       total,
//       points
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       ok: false,
//       msg: 'Hable con el administrador'
//     })
//   }
// }
const getPoints = async (req = request, res = response) => {
  try {
    const { limit = 5, offset = 0 } = req.query

    // Pipeline de agregación
    const pipeline = [
      { $match: { status: true } }, // Filtrar por estado activo
      {
        $group: {
          _id: '$user', // Agrupar por usuario
          totalPoints: { $sum: '$points' }, // Sumar los puntos de cada usuario
          user: { $first: '$user' }, // Obtener el ID del usuario
          createdAt: { $first: '$createdAt' }, // Obtener la fecha de creación más antigua
          updatedAt: { $last: '$updatedAt' }, // Obtener la fecha de actualización más reciente
          status: { $first: '$status' } // Conservar el estado
        }
      },
      {
        $lookup: { // Vincular la información del usuario
          from: 'users', // Nombre de la colección de usuarios
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo' // Aplanar el resultado de la unión
      },
      {
        $project: { // Seleccionar campos específicos para la respuesta
          _id: '$user',
          totalPoints: 1,
          createdAt: 1,
          updatedAt: 1,
          status: 1,
          user: {
            name: '$userInfo.name' // Devolver solo el nombre del usuario
          }
        }
      },
      { $sort: { totalPoints: -1 } }, // Ordenar por total de puntos en orden descendente
      { $skip: Number(offset) }, // Aplicar paginación
      { $limit: Number(limit) }
    ]

    const points = await Points.aggregate(pipeline)

    // Total de usuarios únicos
    const total = await Points.distinct('user', { status: true }).then(users => users.length)

    return res.status(200).json({
      ok: true,
      total,
      points
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}
// Obtener Point populate{} por id

const getPoint = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const point = await Points.findById(id)
    console.log(point)

    if (!point.status) {
      return res.status(401).json({
        ok: false,
        msg: 'point no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'get API - PointGet',
      point
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Actualizar Point

const updatePoint = async (req = request, res = response) => {
  try {
    // capturando query params
    const { id } = req.params

   const { status, ...data } = req.body; //eslint-disable-line

    data.name = data.name.toUpperCase()
    const { name } = data

    const PointDb = await Points.findOne({ name })

    if (PointDb) {
      return res.status(400).json({
        msg: `El Point ${PointDb.name}, ya existe`
      })
    }

    const point = await Points.findByIdAndUpdate(
      id,
      data,
      { new: true }
   ); //eslint-disable-line

    if (!point.status) {
      return res.status(401).json({
        msg: 'point no encontrada',
        point: point
      })
    }

    return res.status(200).json({
      msg: 'put API - PointPut',
      Point: point
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Borrar Point estado :false

const deletePoint = async (req = request, res = response) => {
  try {
    const { id } = req.params

    // const Point = await Point.deleteOne({
    //   _id:
    //   id
    // })
    const points = await Points.findOne({
      _id:
      id
    })
    console.log(points)
    // const Point = await Point.findByIdAndUpdate(
    //   id,
    //   { status: false },
    //   { new: true }
    // )

    if (!points) {
      return res.status(401).json({
        msg: 'Point no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      msg: 'delete API - PointDelete'
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
  createPoint,
  getPoints,
  getPoint,
  updatePoint,
  deletePoint
}
