import {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
  } from "@mattrglobal/bbs-signatures";

async function createBbsProof(
  // VCからsignature取得？
    signature: Uint8Array,
    publicKey: Uint8Array,
    VC: object) : Promise<Uint8Array>{
      
    //Derive a proof from the signature revealing the first message
    const messages = [
      Uint8Array.from(Buffer.from(JSON.stringify(VC), "utf-8")),
    ]
    //Derive a proof from the signature revealing the first message
    const proof = await blsCreateProof({
      signature,
      publicKey: publicKey,
      messages,
      nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
      revealed: [0],
    });
    return proof;
  
}

export default createBbsProof;