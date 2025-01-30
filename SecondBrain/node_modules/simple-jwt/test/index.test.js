const JWT = require('../index.js');
const Chai = require('chai');

// Do not change this data without generating a new test token from an independent source!
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

// This token was generated using the data below exactly on http://jwt.io
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJteXdlYnNpdGUuY29tIiwidXNlcklEIjoiMTIzNDU2Nzg5MCIsImFjY2Vzc0xldmVsIjoidXNlciJ9./r8isDx3/ulr2qbPyXOsF8+wQ9IdwGpKJHDuk8z2Uzx4Z/uj/M/vo6x/Mo/cmRdy9w/QH5LWN+Vhv3VByWbSYw==';

describe('JWT', () => {
    it('getToken encodes a header and payload object into a JSON Web Token and returns the complete token.', () => {        
        const token = JWT.getToken(header, payload, secret);
        Chai.expect(token).to.equal(testToken);
    });
    it('verifyToken validates an encoded header given the secret used to sign the token originally.', () => {
        const isValid = JWT.verifyToken(testToken, secret);
        Chai.expect(isValid).to.be.true;
    });
    it('decodeTokenHeaderAndPayload should take the encoded token and return an object with the header and payload properites.', () => {
        const tokenData = JWT.decodeTokenHeaderAndPayload(testToken);
        Chai.expect(tokenData.header.typ).to.equal('JWT');
        Chai.expect(tokenData.header.alg).to.equal('HS512');

        Chai.expect(tokenData.payload.iss).to.equal('mywebsite.com');
        Chai.expect(tokenData.payload.userID).to.equal('1234567890');
        Chai.expect(tokenData.payload.accessLevel).to.equal('user');
    });
});