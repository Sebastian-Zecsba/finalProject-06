const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');
const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

//! New things
// const fs = require('fs');
// const path = require('path');

const getAll = catchError(async(req, res) => {
    const results = await ProductImg.findAll({include: Product});
    return res.json(results);
});

//TODO: With Multer
// const create = catchError(async(req, res) => {
//     const url = req.protocol + "://" + req.headers.host + "/uploads/" + req.file.filename;
// 		const filename = req.file.filename;
//     const result = await ProductImg.create({ url, filename });
//     return res.status(201).json(result);
// });

// const remove = catchError(async(req, res) => {
//     const { id } = req.params;
//     const image = await ProductImg.findByPk(id);
// 		if(!image) return res.sendStatus(404);
//     fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', image.filename));
//     await image.destroy();
//     return res.sendStatus(204);
// });

//TODO: With Cloudinary
const create = catchError(async(req, res) => {
  const images = req.files.map(file => {
      const url = req.protocol + "://" + req.headers.host + "/uploads/" + file.filename;
      const filename = file.filename;
      return { url, filename };
  })
  const result = await ProductImg.bulkCreate(images);
  return res.status(201).json(result);
});

const remove = catchError(async(req, res) => {
  const { id } = req.params;
  const image = await ProductImg.findByPk(id);
  if(!image) return res.sendStatus(404);
  await deleteFromCloudinary(image.filename);
  await image.destroy();
  return res.sendStatus(204);
});


module.exports = {
    getAll,
    create,
    remove
}