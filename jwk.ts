export interface StringObject{
    [key: string]: string;
}




export const getKeyString = (jwk: StringObject) => {
    const attrs: StringObject = {
        OKP: "x",
        RSA: "n"
    }
    const index = jwk["kty"];
    return jwk[attrs[index]];
}