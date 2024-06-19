const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const fileDestination = 'Files/';
const nodemailer = require("nodemailer");
const moment = require("moment");
const { Op } = require("sequelize");
const { Company } = require('../database');

const multerUploadRoute = multer({ dest: fileDestination }).single('file');

async function multerFileUploader(file) {
  try {

    if (!file) {
      return false;
    }

    const dateTimeStamp = Date.now();
    const fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const fileName = file.fieldname + '-' + dateTimeStamp + '.' + fileExtension;

    if (file.mimetype.startsWith('image/')) {
      let transformedFile = file.path;
      transformedFile = await sharp(file.path)
        .resize(300) // Resize images to 300 px width
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



function multerFileUploaderWithoutCompress(file) {
  try {

    if (!file) {
      return false;
    }

    const dateTimeStamp = Date.now();
    const fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];
    const fileName = file.fieldname + '-' + dateTimeStamp + '.' + fileExtension;
    fs.renameSync(file.path, fileDestination + fileName);
    return fileName;

  } catch (error) {
    return false;
  }
}



function randomCharactersGenerator(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function randomNumbersGenerator(length) {
  var result = '';
  var numbers = '0123456789';
  var numbersLength = numbers.length;
  for (var i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbersLength));
  }
  return parseInt(result);
}


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


const nodemailerTransporter = nodemailer.createTransport({
  service: 'gmail',
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "achievetechserver@gmail.com",
    pass: "atopibasstklngoo"
  },
});

const databaseBackupFileName = "achieve_oms-backup.sequelize";

function databaseBackupFileNameGenerator() {
  const dateTimeStamp = (new Date()).toISOString().slice(0, 19).replace(/[-:T]/g, '');
  const filePrefix = 'achieve_oms-backup_';
  const fileExt = '.sequelize';
  return filePrefix + dateTimeStamp + fileExt;
}

function dateStatementReturn(reqQuery) {
  var dateStatement = {};

  if (reqQuery.type == 'this-month') {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == 'last-month') {
    const start = moment().subtract(1, 'month').startOf('month');
    const end = moment().subtract(1, 'month').endOf('month');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == 'today') {
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == 'yesterday') {
    const start = moment().subtract(1, 'day').startOf('day');
    const end = moment().subtract(1, 'day').endOf('day');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == '7-days') {
    const start = moment().subtract(6, 'days').startOf('day');
    const end = moment().endOf('day');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == '30-days') {
    const start = moment().subtract(1, 'month').startOf('day');
    const end = moment().endOf('day');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == 'custom-date') {
    const start = moment(reqQuery.date).startOf('day');
    const end = moment(reqQuery.date).endOf('day');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  } else if (reqQuery.type == 'custom-date-range') {
    const start = moment(reqQuery.fromDate).startOf('day');
    const end = moment(reqQuery.toDate).endOf('day');
    dateStatement = {
      createdAt: {
        [Op.between]: [start, end]
      },
    }

  }

  return dateStatement;
}

async function gamingLabCompanyId() {
  const company = await Company.findOne({
    where: {
      type: 'gaming-lab',
    },
    attributes: ['id'],
  });

  if (company) {
    return company.id;
  } else {
    return null;
  }

}




// =================================================================
// Pagination Filtration Web (for skote)
function paginationFiltrationWeb(reqQuery, itemsCount, where, include, exclude) {

  function isValidValue(value) {
    if (value && value != 'null') { return value } else { return null };
  }

  const mySearch = isValidValue(reqQuery.search) ? reqQuery.search : '';
  const mySize = isValidValue(reqQuery.size) ? (parseInt(reqQuery.size) ? parseInt(reqQuery.size) : 10) : 10;
  const myPage = isValidValue(reqQuery.page) ? (parseInt(reqQuery.page) ? parseInt(reqQuery.page) : 1) : 1;
  const mySort = isValidValue(reqQuery.sort) ?? 'createdAt';
  const myOrder = isValidValue(reqQuery.order) ?? 'DESC';
  const myOffset = myPage ? ((myPage - 1) * mySize) : 0;
  const myWhere = where ?? {};
  const myInclude = include ?? [];
  const myExclude = exclude ?? [];
  const myItemsCount = itemsCount;
  const totalPages = Math.max(Math.ceil(myItemsCount / mySize), 1);

  const filter = {
    limit: mySize,
    offset: myOffset,
    where: myWhere,
    include: myInclude,
    order: [[mySort, myOrder]],
    attributes: {
      exclude: myExclude,
    },
  }

  const pagination = {
    page: myPage,
    size: mySize,
    startIndex: myOffset + 1,
    endIndex: Math.min(myOffset + mySize, itemsCount),
    totalItems: myItemsCount,
    totalPages: totalPages,
    sort: mySort,
    order: myOrder,
    search: mySearch,
  }


  var next = null

  if (myPage < totalPages) {
    next = {
      page: myPage + 1,
      size: mySize,
      sort: mySort,
      order: myOrder,
    };
  }

  return {
    filter,
    pagination,
    next,
  };
}


function isValueNotNull(value) {
  if (value && value != 'null') {
    return true;
  } else {
    return false;
  }
}

function isValueNotNullAndAll(value) {
  if (value && value != 'null' && value != 'all') {
    return true;
  } else {
    return false;
  }
}


module.exports = {
  multerUploadRoute,
  multerFileUploader,
  randomCharactersGenerator,
  randomNumbersGenerator,
  fileRemover,
  multerFileUploaderWithoutCompress,
  nodemailerTransporter,
  fileDestination,
  databaseBackupFileNameGenerator,
  databaseBackupFileName,
  dateStatementReturn,
  gamingLabCompanyId,
  paginationFiltrationWeb,
  isValueNotNull,
  isValueNotNullAndAll,
};
