var jwt = require('jwt-simple');
var payload = { username: 'prakhar', password:'prakhar' };
var secret = 'xxx';
var secrets = 'lll'
 
// HS256 secrets are typically 128-bit random strings, for example hex-encoded: 
// var secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex) 
 
// encode 
var token = jwt.encode(payload, secret, 'HS256');
console.log("encoded",token);
 
// decode 
var decoded = jwt.decode(token, secret, false, 'HS256');
console.log(decoded); 
// decode 
/*var decoded = jwt.decode(token, secrets, false, 'HS256');
console.log(decoded); */