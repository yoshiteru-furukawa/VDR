# vpComposeAPI
Using https://github.com/mattrglobal/bbs-signatures

# Usage

Throw a POST request to the following URL


//To create VP...
http://domain:3000/create_vp


input---<br>
signature: signature(proofValue) of VC<br>
publicKey: Issuer's publicKey<br>
revealed: indices of revealed message<br>
messages: messages

output---<br>
proof: proofValue of VP

※This API does not strictly generate VPs.<br>
※You get only the proofValue

