const Crypto = require('crypto');
const uuidv4 = require('uuid/v4')

// This is just for reference.
// const defaultOptions = {
//     header: {
//         typ: 'JWT',
//         alg: 'HS512'
//     },
//     payload: {
//         iss: undefined,
//         exp: undefined,
//         nbf: undefined,
//         sub: undefined,
//         aud: undefined
//     }
// };

class JWT {
    constructor () {
    }

    static getToken (header, payload, secret, base64EncodeSecret = false) {       
        const headerString = this._base64EncodeObject(header);
        const payloadString = this._base64EncodeObject(payload);
        if(base64EncodeSecret === true) {
            secret = this._base64EncodeString(secret);
        }
        const signature = this._getSignature(headerString, payloadString, header.alg, secret);//hmac.digest('base64');
        return `${headerString}.${payloadString}.${signature}`;
    }
    
    static verifyToken(token, secret, base64EncodeSecret = false) {
        let parts = token.split('.');
        let signature = parts[2];
        const header = this._base64StringToUTF8(parts[0]);
        if(base64EncodeSecret === true) {
            secret = this._base64EncodeString(secret);
        }
        const incommingSignature = this._getSignature(parts[0], parts[1], header.alg, secret);
        return signature === incommingSignature;
    }

    static decodeTokenHeaderAndPayload(token) {
        const tokenParts = token.split('.');
        const header = JSON.parse(this._base64StringToUTF8(tokenParts[0]));
        const payload = JSON.parse(this._base64StringToUTF8(tokenParts[1]));
        return {
            header,
            payload
        }
    }

    static generateRandomSecret (numRuns = 5) {
        let secret = '';
        for(let i = 0; i < numRuns; i++){
            secret += uuidv4();
        }
        return secret.replace(/-/g, '');
    }

    static _getHmac (alg, secret) {
        let hmac = null;
        if (alg === 'HS256') {
            hmac = Crypto.createHmac('sha256', secret);
        } else if (alg === 'HS512') {
            hmac = Crypto.createHmac('sha512', secret);
        } else {
            hmac = Crypto.createHmac(alg, secret)
        }
        if(hmac === null) {
            throw `${alg} is not a supported algorythm!`;
        }
        return hmac;
    }

    static _getSignature (base64Header, base64Payload, alg, secret) {
        const header = JSON.parse(this._base64StringToUTF8(base64Header));
        let hmac = this._getHmac(header.alg, secret); 
        hmac.update(`${base64Header}.${base64Payload}`);
        return hmac.digest('base64');
    }

    static _base64EncodeObject (obj) {
        return this._base64EncodeString(JSON.stringify(obj));
    }

    static _base64EncodeString (str) {
        return new Buffer(str, 'utf8').toString('base64');
    }

    static _base64StringToUTF8 (str) {
        return new Buffer(str, 'base64').toString('utf8');
    }

}

module.exports = JWT;