
const tokenKey = 'token'
const expirationKey = 'token-expiration'

export function saveToken(authData) {
    console.log(authData);

    // Čuvamo token u localStorage
    localStorage.setItem(tokenKey, authData.token);

    // Dekodiramo token da bismo pročitali `exp` polje
    const payloadBase64 = authData.token.split('.')[1]; // Drugi deo JWT-a je payload
    const payloadDecoded = JSON.parse(atob(payloadBase64.replace(/_/g, '/').replace(/-/g, '+'))); // Base64 URL decoding
    
    if (payloadDecoded.exp) {
        // Čuvamo `exp` u localStorage
        localStorage.setItem(expirationKey, payloadDecoded.exp.toString());
    } else {
        console.warn("Token nema exp polje!");
    }
}

export function getClaims() {
    const token = localStorage.getItem(tokenKey);

    if (!token) {
        console.log("molim")
        return [];
    }

    const expiration = localStorage.getItem(expirationKey);
    const expirationDate = new Date(expiration);

    if (expirationDate <= new Date()) {
        logout();
        console.log("token je istekao");
        return []; // Token je istekao
    }

    const dataToken = JSON.parse(atob(token.split('.')[1]));
    const response = [];
    for (const property in dataToken) {
        response.push({ name: property, value: dataToken[property] });
    }
    
    return response;
}

export function logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(expirationKey);
}