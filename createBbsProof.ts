import {
    blsCreateProof,
  } from "@mattrglobal/bbs-signatures";

async function createBbsProof(
    signature: Uint8Array,
    publicKey: Uint8Array,
    revealed: number[],
    messages: string[]) : Promise<Uint8Array>{
      
    //Derive a proof from the signature revealing the first message
    const messages_ = [];
    for (const message of messages) {
      messages_.push(Uint8Array.from(Buffer.from(JSON.stringify(message), "utf-8")));
    }
    //Derive a proof from the signature revealing the first message
    const proof = await blsCreateProof({
      signature,
      publicKey: publicKey,
      messages: messages_,
      nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
      revealed: revealed,
    });
    return proof;
  
}

export default createBbsProof;