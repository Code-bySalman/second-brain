# simple-jwt
A simple JWT library

A good reference on JWT is http://jwt.io

# A note on hmac selection
Below are a list of hmacs specified in the code.
* HS256 - HMAC using sha256
* HS512 - HMAC using sha512

You can also pass any valid value in you header in the property `alg` somthing must me provided for that value and it must be a valid input to `createHmac` from the `Crypto` Node package when generating or verifying a token.

# Code samples

## Generating a token

```javascript
const JWT = require('simple-jwt');
const header = {
    typ: 'JWT',
    alg: 'HS512'
};

const payload = {
    iss: 'mywebsite.com',
    userID: '1234567890',
    accessLevel: 'user',
};

const secret = 'secret';

const token = JWT.getToken(header, payload, secret);
// token = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJteXdlYnNpdGUuY29tIiwidXNlcklEIjoiMTIzNDU2Nzg5MCIsImFjY2Vzc0xldmVsIjoidXNlciJ9./r8isDx3/ulr2qbPyXOsF8+wQ9IdwGpKJHDuk8z2Uzx4Z/uj/M/vo6x/Mo/cmRdy9w/QH5LWN+Vhv3VByWbSYw==
```

## Validating a token

```javascript
const JWT = require('simple-jwt');

const secret = 'secret';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJteXdlYnNpdGUuY29tIiwidXNlcklEIjoiMTIzNDU2Nzg5MCIsImFjY2Vzc0xldmVsIjoidXNlciJ9./r8isDx3/ulr2qbPyXOsF8+wQ9IdwGpKJHDuk8z2Uzx4Z/uj/M/vo6x/Mo/cmRdy9w/QH5LWN+Vhv3VByWbSYw==';

/* verifyToken returns true is the token is valid and false if not, but currently does not check nbf (not before) or exp (expires), or any other properties in the payload! You must validate those your self. */
const isValid = JWT.verifyToken(token, secret); 

// isValid = true

```