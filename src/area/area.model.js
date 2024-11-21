const { Schema, model } = require('mongoose')

const AreaSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
  // faculty: {
  //   type: String,
  //   required: [true, 'La facultad es obligatoria'],
  //   unique: true
  // }
})

AreaSchema.methods.toJSON = function () {
  const { __v, _id, ...area } = this.toObject(); //eslint-disable-line
  area.uid = _id
  return area
}
const Area = model('Area', AreaSchema)
module.exports = Area
