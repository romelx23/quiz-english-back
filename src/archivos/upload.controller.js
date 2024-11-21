const { response, request } = require('express')
const { subirArchivo } = require('../helpers')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const User = require('../user/user.model')

const cargarArchivos = async (req = request, res = response) => {
  try {
    // Imagenes
    // const nombre = await subirArchivo(req.files, ["txt", "md"],"textos");
    const name = await subirArchivo(req.files, undefined, 'imgs')

    res.json({
      name
    })
  } catch (error) {
    res.status(400).json({
      msg: 'archivo no valido'
    })
  }
}

const actualizarImagen = async (req = request, res = response) => {
  const { id, collection } = req.params

  let model

  switch (collection) {
    case 'usuarios':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
      })
  }

  // Limpiar Imagenes previas

  if (model.img) {
    // Ha que borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      '../uploads',
      collection,
      model.img
    )
    if (fs.existsSync(pathImagen)) {
      // borrar un archivo
      fs.unlinkSync(pathImagen)
    }
  }

  const name = await subirArchivo(req.files, undefined, collection)
  model.img = name
  await model.save()

  res.json({
    modelo: model
  })
}

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await User.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
      })
  }

  // Limpiar Imagenes previas

  if (modelo.img) {
    // Ha que borrar la imagen del servidor

    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    )
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen)
    }
  }

  const pathNoImage = path.join(__dirname, '../assets/no-image.jpg')

  res.sendFile(pathNoImage)
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params

  let model

  switch (coleccion) {
    case 'usuarios':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto'
      })
  }

  // Limpiar Imagenes previas

  if (model.img) {
    const nombreArr = model.img.split('/')
    const nombre = nombreArr[nombreArr.length - 1]
    const [publicId] = nombre.split('.')
    await cloudinary.uploader.destroy(publicId)
    console.log(publicId)
  }

  const { tempFilePath } = req.files.archivo

  const { secure_url: secureUrl } = await cloudinary.uploader.upload(tempFilePath)

  model.img = secureUrl
  await model.save()

  res.json({
    modelo: model
  })
}

module.exports = {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
}
