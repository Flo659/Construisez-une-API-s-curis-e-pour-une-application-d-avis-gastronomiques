const multer= require("multer");
const path = require("path");

const checkFileType = (file, callback) =>{
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName){
      callback(null, true);
  }else{
      callback("Erreur: seule les images peuvent être téléchargé !");
  }
};

const fileFilter= (req, file, callback) =>{
  checkFileType(file, callback);
};

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null,"images");
    },
    filename: (req, file, callback) =>{
        callback(null,  Date.now() + file.originalname);
    }
});

module.exports = multer({storage: storage, fileFilter: fileFilter}).single("image");