const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: 'dyoq8stgr',
    api_key: '196779951973952',
    api_secret: '2NpoAIaBwD0HHfX-hEr-ERGDIDI'
  });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Rinvent",
  },
});

const upload = multer({ storage });

module.exports=upload;