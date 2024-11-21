const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/connection')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT
    // Rutas de mi aplicacion
    this.paths = {
      auth: '/api/auth',
      files: '/api/file',
      // area: '/api/area',
      // services: '/api/service',
      // search: '/api/search',
      // category: '/api/category',
      // uploads: '/api/uploads',
      user: '/api/user',
      points: '/api/points'
    }
    // this.usuariosPath = "/api/usuarios";
    // this.authPath = "/api/auth";

    // Morgan
    this.app.use(morgan('dev'))

    // Conectar a base de datos
    this.conectarDB()

    // Midelwares
    this.middleware()

    // rutas de mi aplicacion
    this.routes()

    // Directorio publico
    this.app.use(express.static('public'))
  }

  async conectarDB () {
    await dbConnection()
  }

  middleware () {
    // Directorio publico
    this.app.use(express.static('public'))
    // Lestura y parseo del codigo
    this.app.use(express.json())
    // CORS
    this.app.use(cors())
    // File upload- Carga de archivo
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true
      })
    )
  }

  routes () {
    this.app.use(this.paths.auth, require('../auth/auth.routes'))
    // this.app.use(this.paths.area, require('../area/area.routes'))
    this.app.use(this.paths.files, require('../files/file.routes'))
    // this.app.use(this.paths.services, require('../services/services.routes'))
    // this.app.use(this.paths.search, require('../buscar/buscar.routes'))
    // this.app.use(this.paths.category, require('../category/category.routes'))
    // this.app.use(this.paths.uploads, require('../archivos/upload.routes'))
    this.app.use(this.paths.user, require('../user/user.routes'))
    this.app.use(this.paths.points, require('../points/points.routes'))
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('servidor corriendo el puerto ', this.port)
    })
  }
}

module.exports = Server
