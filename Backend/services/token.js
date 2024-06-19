const jwt = require("jsonwebtoken");
const http_status_codes = require("http-status-codes");
const secretKey = "Pander@Emp";


var tokenCheckerMiddleWare = function (req, res, next) {
    var headerToken = req.headers.authorization;
    if (headerToken) {
        const token = headerToken.split(' ')[1];
        if (token) {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    if (err.expiredAt < new Date()) {
                        return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                            status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                            status: false,
                            message: 'Token has expired please login again!',
                        });
                    } else {
                        return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                            status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                            status: false,
                            message: 'Invalid token!',
                        });
                    }
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                status: false,
                message: 'No token found!',
            });
        }
    } else {
        return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
            status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
            status: false,
            message: 'No authorization!',
        });
    }
};

var tokenCreator = function (someUniqueValue) {
    // Pass some uniqueValue in parameter to return token
    const token = jwt.sign({
        uniqueValue: someUniqueValue,
    },
        secretKey, {
        expiresIn: "7d"
    });
    return token;
}


var allowedUrls = [
    // Admin Panel urls
    '/ap/admin/login',
    '/ap/admin/email-verification-code',
    '/ap/employee/login',
    '/ap/custom-variable/get-login-background',
    '/ap/employee/email-verification-code',
    // User App urls
];

// var allowedUrlWithParams = [];

// var allowedUrlsWithParamsChecker = function (req, res, next) {
//     let result = null;
//     allowedUrlWithParams.forEach(element => {
//         if (element == req.url.slice(0, element.length)) {
//             result = true;
//         }
//     });
//     return result;
// }

var tokenChecker = function (req, res, next) {
    if (
        allowedUrls.includes(req.url)
        // || allowedUrlsWithParamsChecker(req)
    ) {
        next();
    } else {
        tokenCheckerMiddleWare(req, res, next);
    }
}


module.exports = {
    tokenChecker,
    tokenCreator,
};

