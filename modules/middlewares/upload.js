const multer  = require('multer');
const mkdirp  = require('mkdirp');

const FileStorage = multer.diskStorage({
    destination : (req , file , cb) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDay();

        if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
            var dir = `./public/uploads/images/${year}/${month}/${day}`;
        } else {
            var dir = `./public/uploads/files/${year}/${month}/${day}`;

        }
        mkdirp(dir , err => cb(err , dir))
    },
    filename: (req , file , cb) => {
        cb(null, Date.now() +  '-' + file.originalname )
    }
});
const uploadFile = multer({
    storage : FileStorage,
});



module.exports = {
    uploadFile,
};
