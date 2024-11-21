const { Schema, model } = require('mongoose')

const FileShema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  file_id: {
    type: String
  },
  url: {
    type: String
  },
  type: {
    type: String
  }
}, { timestamps: true })

FileShema.methods.toJSON = function () {
    const { __v, _id, ...file } = this.toObject(); //eslint-disable-line
  file.id = _id
  return file
}

const FileEntity = model('File', FileShema)

module.exports = FileEntity
