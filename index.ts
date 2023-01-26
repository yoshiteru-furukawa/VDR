import express from 'express'
import db from './lib/database';
import { createDidQuery, createKeyQuery, retrieveKeyQuery } from './lib/queryString';

const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//CORS対応
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

app.listen(8000, () => {
    console.log("Start on port 8000.")
})

app.get('/test', async function(req, res) {
    const pubKeys = [JSON.stringify({
        "kty": "RSA",
        "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
        "e": "AQAB"
    })]
    const type = "issuer";
    // count dids
    const sqlCount = "select * from dids";
    db.query(sqlCount, function(err, result, fields){
        if (err) throw err;
        // create did
        const did: string = `did:example:${type}${result.length+1}`;
        console.log(did);
        db.query(createDidQuery(did), 
            function(_err, _result, _fields){
                if (_err) throw _err;
                console.log(_result);});
        
                var keys = new Array();

                // register did into db (複数の鍵) jwk did, kid
                for (let i=0; i<pubKeys.length; i++){
                    var key = JSON.parse(pubKeys[i]);
                    key["kid"] = `${did}#${i+1}`;
                    db.query(createKeyQuery(key, `${did}#${i+1}`), 
                        function(err, result, fields){
                        if (err) throw err;
                        console.log(result);
                    });
                    keys.push(key);
                }
                
                return res.json({
                    "id": did,
                    "keys": keys
                });

    });
})

/**
 *  input: jwkSet: String
 *       : type :String -> holder or issuer
 * 
 *  output: resultJson: Json
 */

app.post('/create_did', async (req, res) => {

    // count dids
    const sqlCount = "select * from dids";
    db.query(sqlCount, function(err, result, fields){
        if (err) throw err;
        // create did
        const did: string = `did:example:${req.body.type}${result.length+1}`;
        console.log(did);
        db.query(createDidQuery(did), 
            function(_err, _result, _fields){
                if (_err) throw _err;
                console.log(_result);});
        
                var keys = new Array();

                // register did into db (複数の鍵) jwk did, kid
                for (let i=0; i<req.body.publicKeys.length; i++){
                    var key = JSON.parse(req.body.publicKeys[i]);
                    key["kid"] = `${did}#${i+1}`;
                    db.query(createKeyQuery(key, `${did}#${i+1}`), 
                        function(err, result, fields){
                        if (err) throw err;
                        console.log(result);
                    });
                    keys.push(key);
                }
                
                return res.json({
                    "id": did,
                    "keys": keys
                });

    });
})

/**
 *  input: kid: String
 * 
 *  output: resultJson: Json
 */
app.post('/retrieve_key', async (req, res) => {
    // key取得
    const sql = retrieveKeyQuery(req.body.kid);
    db.query(sql, function(err, result, fields){
        if (err) throw err;
        if (result.length === 0){
            return res.json({
                "jwk": {}
            });
        }
        return res.json({
            "jwk": JSON.parse(result[0].jwk),
            "keyString": result[0].keyString
        });
    });
    
})

app.get('/a',async (req, res) => {
    // key取得
    // key取得
    var kid = "did:example:issuer2#1";
    const sql = retrieveKeyQuery(kid);
    console.log(sql);
    
    db.query(sql, function(err, result, fields){
        if (err) throw err;
        if (result.length === 0){
            return res.json({
                "key": "not found"
            });
        }
        console.log(result);
        console.log(typeof result[0].jwk);
        return res.json({
            "jwk": JSON.parse(result[0].jwk),
            "keyString": result[0].keyString
        });
    });
})
