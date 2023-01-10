import express from 'express'
import getBlsVerifiedResult from './blsVerify';
import createBbsKeyPair from './createBbsKeyPair';
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

app.listen(8000, () => {
    console.log("Start on port 8000.")
})


// input  : signature
//        : publickey
//        : VC
//
// output : proof
app.post('/create_vp', async function(req, res) {
    const proof = await createBbsProof(
        req.body.signature,
        req.body.publicKey,
        req.body.messages,
        req.body.revealed,
        req.body.nonce,
    );

    res.json({
        "proof": proof
    });
})


// input  : signature
//        : publickey
//        : VC
//
// output : proof
app.get('/create_key_pair', async function(req, res) {
    const keyPair = await createBbsKeyPair();

    res.json({
        "keyPair": keyPair,
    });
})

// input  : signature
//        : publickey
//        : VC
//
// output : proof
app.get('/bls_verify', async function(req, res) {
    const is_verified = await getBlsVerifiedResult(
        req.body.signature,
        req.body.publicKey,
        req.body.messages
    );

    res.json({
        "is_verified": is_verified
    });
})

