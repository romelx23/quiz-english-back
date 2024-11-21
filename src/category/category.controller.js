const { request, response } = require('express')
const Category = require('./category.model')
const { createCategorySchema } = require('./category.dto')
// const Incident = require('../incident/incident.model')

const createCategory = async (req = request, res = response) => {
  try {
    const { error } = createCategorySchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        ok: false,
        errors: error.details.map((detail) => detail.message)
      })
    }

    const name = req.body.name.toUpperCase()

    const categoryDB = await Category.findOne({ name })

    if (categoryDB) {
      return res.status(400).json({
        msg: `La Category ${categoryDB.name}, ya existe`
      })
    }
    // generar la dataa guardar
    const data = {
      name: name
    }

    const category = new Category(data)

    // GuardarDB
    await category.save()

    return res.status(201).json(
      {
        ok: true,
        msg: 'Category creado',
        category
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

// Obtener Categorys - paginados - total - populate

const getCategories = async (req = request, res = response) => {
  try {
    const { limit = 5, offset = 0, search = '' } = req.query
    const query = { status: true }

    if (search && search !== 'null' && search !== 'undefined') {
      console.log(search)
      query.name = { $regex: search, $options: 'i' }
    }

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
    ])

    return res.status(200).json({
      total,
      categories
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Obtener Category populate{} por id

const getCategory = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)

    if (!category.status) {
      return res.status(401).json({
        ok: false,
        msg: 'category no encontrada'
      })
    }

    return res.status(200).json({
      ok: true,
      category
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// Actualizar Category

const updateCategory = async (req = request, res = response) => {
  // capturando query params
  const { id } = req.params

  const { estado, usuario, ...data } = req.body; //eslint-disable-line

  data.name = data.name.toUpperCase()
  const { name } = data
  data.usuario = req.usuario._id

  const categoryDB = await Category.findOne({ name })

  if (categoryDB) {
    return res.status(400).json({
      msg: `La Category ${categoryDB.name}, ya existe`
    })
  }

  const category = await Category.findByIdAndUpdate(
    id,
    data,
    { new: true }
  ); //eslint-disable-line

  if (!category.estado) {
    return res.status(401).json({
      msg: 'category no encontrada',
      category
    })
  }

  res.status(200).json({
    msg: 'put API - categoryPut',
    category
  })
}

// Borrar Category estado :false

const deleteCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params

    // const associatedIncidents = await Incident.find({ category: id })

    // if (associatedIncidents.length > 0) {
    //   return res.status(400).json({
    //     ok: false,
    //     msg: 'Category cannot be deleted. It is associated with incidents.'
    //   })
    // }

    const category = await Category.deleteOne({
      _id:
    id
    })
    // const category = await Category.findOne({
    //   _id:
    // id
    // })
    // console.log('asociados', associatedIncidents)
    console.log('categoria', category)
    // const category = await Category.findByIdAndUpdate(
    //   id,
    //   { estado: false },
    //   { new: true }
    // )

    if (!category) {
      return res.status(401).json({
        msg: 'category no encontrada'
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
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}
