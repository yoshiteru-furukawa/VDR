import { getKeyString, StringObject } from "./jwk";

/**
 *  input: did: String
 * 
 *  output: query: String
 */

export function createDidQuery(did: String){
    const sql = `insert into dids VALUES ('${did}')`;
    return sql;
}


/**
 *  input: jwk, kid
 * 
 *  output: query
 */
export function createKeyQuery(jwk: StringObject, kid: String){
    const sql = `insert into publicKey VALUES ('${JSON.stringify(jwk)}', '${kid}', '${getKeyString(jwk)}')`;
    return sql;
}

/**
 *  input: kid
 * 
 *  output: query
 */
export function retrieveKeyQuery(kid: String){
    const sql = `select * from publicKey where kid='${kid}'`;
    const sql1 = `select * from publicKey`;
    return sql;
}