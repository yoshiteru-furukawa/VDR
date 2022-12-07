import express from 'express'
import {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
    createProof,
  } from "@mattrglobal/bbs-signatures";
import createBbsProof from './createBbsProof';

const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//CORS対応（本番環境では見直し）
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

app.listen(3000, () => {
    console.log("Start on port 3000.")
})


//一覧取得
app.get('/users', async (req: express.Request, res: express.Response) => {
    try{
        //Generate a new key pair
        const keyPair = await generateBls12381G2KeyPair();
        const publicKey = keyPair.publicKey;
        const VC = {
            "@context": [ 
                "http://schema.org/", 
                "https://w3id.org/security/v2",
                "https://w3id.org/security/bbs/v1" 
              ], 
            "id": "urn:bnid:_:c14n0", 
            "email": "jane.doe@example.com", 
            "firstName": "Jane", 
            "jobTitle": "Professor", 
            "lastName": "Does", 
            "telephone": "(425) 123-4567", 
            
            "proof": { 
                "type": "BbsBlsSignatureProof2020", 
                "created": "2020-04-25", 
                "verificationMethod": "did:example:489398593#test", 
                "proofPurpose": "assertionMethod", 
                "proofValue": "kTTbA3pmDa6Qia/…"
            }
        };
        const signature = await blsSign({
            keyPair,
            messages: [Uint8Array.from(Buffer.from(JSON.stringify(VC), "utf-8"))],
        });

        const proof = await createBbsProof(signature, publicKey,  Uint8Array.from(Buffer.from(JSON.stringify(VC), "utf-8")));

        res.json({"proof": proof});
    }catch (error) {console.log(error)}
      
    
})

// input  : signature
//        : publickey
//        : VC
//
// output : proof
app.post('/', async function(req, res) {
    const proof = await createBbsProof(
        req.body.signature,
        req.body.publicKey,
        req.body.VC
    );

    res.json({
        "proof": proof
    });
})
