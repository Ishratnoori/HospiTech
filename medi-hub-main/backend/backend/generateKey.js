const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Your secure JWT secret key is:');
console.log(secretKey); 