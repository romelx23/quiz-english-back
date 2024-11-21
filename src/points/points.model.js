const { Schema, model } = require('mongoose')

const PointSchema = new Schema({
  points: {
    type: Number,
    required: [true, 'Los puntos son obligatorios']
    // unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true
})

PointSchema.methods.toJSON = function () {
  const { __v, _id, ...point } = this.toObject(); //eslint-disable-line
  point.uid = _id
  return point
}
const Area = model('Point', PointSchema)
module.exports = Area
