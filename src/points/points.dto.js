const Joi = require('joi')

// Define the Joi schema for the createArea DTO
const createPointSchema = Joi.object({
  points: Joi.number().required(),
  user: Joi.string().required()
})

const editPointSchema = Joi.object({
  points: Joi.number()
})

module.exports = {
  createPointSchema,
  editPointSchema
}
