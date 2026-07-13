import multer from 'multer'

const storage = multer.memoryStorage();

const fileType = async (req, file, cb) => {
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    };

}

export const upload = multer({
    storage: storage,
    fileType: fileType,

})