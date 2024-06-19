const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const fileDestination = 'Files/';

const multerSingleUploadRoute = multer({ dest: fileDestination }).single('file');
const multerMultipleUploadRoute = multer({ dest: fileDestination }).array('files');

async function multerFileUploader(file, isCompress, size) {
  try {

    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination);
    }

    if (!file) {
      return false;
    }

    const myCompress = isCompress ?? false;
    const mySize = size ?? 300;

    const dateTimeStamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 7); // Generate a random string
    const fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const fileName = file.fieldname + '-' + dateTimeStamp + '-' + randomString + '.' + fileExtension;

    if (file.mimetype.startsWith('image/') && myCompress) {
      let transformedFile = file.path;
      transformedFile = await sharp(file.path)
        .resize(mySize) // Resize images to 300 px width
        .toBuffer();
      fs.unlinkSync(file.path);
      fs.writeFileSync(fileDestination + fileName, transformedFile);
    } else {
      fs.renameSync(file.path, fileDestination + fileName);
    }

    return fileName;

  } catch (error) {
    return false;
  }
}

async function singleFileUploadManager(file, isCompress, size) {

  var fileUploadResponse = null;
  if (file) {
    const fileUploadResult = await multerFileUploader(file, isCompress, size);
    if (!fileUploadResult) {
      fileUploadResponse = null;
    } else {
      fileUploadResponse = fileUploadResult;
    }
  }
  return fileUploadResponse;

}

async function multipleFilesUploadManager(files, isCompress, size) {

  var fileUploadResponse = null;
  if (files && files.length) {
    const uploadPromises = await files.map(async (file) => await multerFileUploader(file, isCompress, size));
    const fileUploadResult = await Promise.all(uploadPromises);
    if (fileUploadResult.includes(false)) {
      fileUploadResponse = null;
    } else {
      fileUploadResponse = fileUploadResult;
    }
  }
  return fileUploadResponse;

}



// =================================================================
// File Remover
function fileRemover(fileName) {
  let result = null;
  try {
    const file = fileDestination + fileName;
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      result = true;
    } else {
      result = false;
    }
  } catch (error) {
    result = false;
  }
  return result;
}


module.exports = {
  multerSingleUploadRoute,
  multerMultipleUploadRoute,
  singleFileUploadManager,
  multipleFilesUploadManager,
  fileRemover,
};

