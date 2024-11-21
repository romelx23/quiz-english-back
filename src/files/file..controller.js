// const { deleteFileFromFirebase } = require('../helpers/upload-file-firebase')
// const Incident = require('../incident/incident.model')
const FileEntity = require('./file.model')

const deleteFile = async (req, res) => {
  const {
    id
  } = req.params

  try {
    const file = await FileEntity.findByIdAndDelete(id)

    if (!file) {
      return res.status(404).json({
        ok: false,
        msg: 'Archivo no encontrado'
      })
    }
    // // delete files id from incident
    // const incident = await Incident.find({ files: { $in: id } })
    // if (incident) {
    //   incident.files = incident.files.filter(fileId => fileId !== id)
    //   await incident.save()
    // }
    // Eliminar referencias al archivo en incidentes
    // await Incident.updateMany(
    //   { files: id },
    //   { $pull: { files: id } }
    // )

    console.log({ file })
    // delete files from firebase
    // await deleteFileFromFirebase(file.file_id)

    return res.status(200).json({
      ok: true,
      msg: 'Archivo eliminado'
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
  deleteFile
}
