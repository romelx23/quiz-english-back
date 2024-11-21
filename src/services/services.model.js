const { Schema, model } = require('mongoose')

const ServicesSchema = new Schema({
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
})

ServicesSchema.methods.toJSON = function () {
  const { __v, _id, ...services } = this.toObject(); //eslint-disable-line
  services.uid = _id
  return services
}
const Services = model('Service', ServicesSchema)
module.exports = Services
