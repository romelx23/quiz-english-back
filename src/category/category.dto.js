const Joi = require('joi')

// Define the Joi schema for the createArea DTO
const createCategorySchema = Joi.object({
  name: Joi.string().required().max(255).trim()
})

module.exports = {
  createCategorySchema
}
