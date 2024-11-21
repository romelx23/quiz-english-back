const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
// only upload images and videos
const uploadFileCloudinary = async (file) => {
  try {
    const { tempFilePath } = file

    // Extract the string path from tempFilePath
    const filePath = await tempFilePath.toString()

    console.log('filePath', filePath)
    console.log('type of', typeof filePath)

    const { secure_url: secureUrl, public_id: publicId } =
    await cloudinary.uploader.upload(filePath, {
      folder: 'incidents'
    })

    console.log({
      secureUrl,
      publicId
    })

    return {
      secureUrl,
      publicId
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

const deleteFileCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = {
  uploadFileCloudinary,
  deleteFileCloudinary
}
