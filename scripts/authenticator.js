var jwt = require('jsonwebtoken');

/*
 * Error handler
 */

function UnauthorizedError(code, error) {
    Error.call(this, error.message);
    this.message = error.message;
    this.code = code;
    this.status = 401;
    this.inner = error;
}
UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

/*
 * Authenticator
 */
module.exports = function(options) {
    if (!options || !options.secret) throw new Error('no secret!');

    return function(req, res, next) {
        var token;

        if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
            if (req.headers['access-control-request-headers'].split(', ').indexOf('authorization') != -1) {
                return next();
            }
        }

        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0],
                    credentials = parts[1];

                if (/^token$/i.test(scheme)) {
                    token = credentials;
                }
            } else {
                return next(new UnauthorizedError('format error!', {
                    message: 'Please set header["Authorization"] = token [token]'
                }));
            }
        } else {
            return next(new UnauthorizedError('need token!', {
                message: 'no header["Authorization"] found'
            }));
        }

        jwt.verify(token, options.secret, options, function(err, decoded) {
            if (err) return next(new UnauthorizedError('invalid token!', err));

            req.profile = decoded;
            next();
        });
    };
};