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
        const did: string = `did:example:${result.length+1}`;
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