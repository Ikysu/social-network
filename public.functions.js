
function authdata_encrypt(authdata) {
  const txt = JSON.stringify(authdata);
  const enc = [];
  for (let i = 0; i < txt.length; i += 1) {
    const keyC = settings.cookie.key[i % settings.cookie.key.length];
    const encC = `${String.fromCharCode(
      (txt[i].charCodeAt(0) + keyC.charCodeAt(0)) % 256,
    )}`;
    enc.push(encC);
  }
  const str = enc.join('');
  return "_iki="+(Buffer.from(str, 'binary').toString('base64'))+"; path=/;";
}

async function authdata_decrypt(authdata) { 
  if(!authdata) return {error:"Куки не переданы"}
  const dec = []; 
  console.log("cookie", authdata)
  const find = authdata.match(/\_iki\=.+?\;|.+/);
  if(!find.length) return {error:"Старая версия куки"}
  authdata=find[0].slice(5).replace(";", "")
  console.log("authdata", authdata)
  const enc = Buffer.from(authdata, 'base64').toString('binary'); 
  for (let i = 0; i < enc.length; i += 1) { 
    const keyC = settings.cookie.key[i % settings.cookie.key.length]; 
    const decC = `${String.fromCharCode((256 + enc[i].charCodeAt(0) - keyC.charCodeAt(0)) % 256)}`; 
    dec.push(decC); 
  }

  console.log("OK", dec)

  try{ 
    var j = JSON.parse(dec.join('')) 
    if(j.login&&j.password){
      let find = await db.Account.findOne({where:{login:j.login,password:j.password}})
      if(find){
        return {pid:find.dataValues.pid};
      }else{
        return {error:"Устаревшие куки"};
      } 
    }else{ 
      return {error:"Старая версия куки"} 
    }
  }catch(e){ 
    console.log(e)
    return {error:"Недействительные куки"} 
  } 
}

function validateLogin(text){
  return /^[0-9a-zA-Z\_\.]{3,12}$/m.test(text)
}

function validatePassword(text){
  return /^.{8,64}$/m.test(text)
}

function validateUsername(text){
  return /^[0-9a-zA-Z\_\.\s\-]{3,30}/m.test(text)
}


export default {
  authdata_encrypt,
  authdata_decrypt,
  validateLogin,
  validatePassword,
  validateUsername
  
}