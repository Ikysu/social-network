
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
  return Buffer.from(str, 'binary').toString('base64');
}

async function authdata_decrypt(authdata) { 
  const dec = []; 
  const enc = Buffer.from(authdata, 'base64').toString('binary'); 
  for (let i = 0; i < enc.length; i += 1) { 
    const keyC = settings.cookie.key[i % settings.cookie.key.length]; 
    const decC = `${String.fromCharCode((256 + enc[i].charCodeAt(0) - keyC.charCodeAt(0)) % 256)}`; 
    dec.push(decC); 
  } 

  try{ 
    var j = JSON.parse(dec.join('')) 
    if(j.login&&j.password){
      let find = await db.Account.findOne({where:{login:j.login,password:j.password}})
      if(find){
        return find.dataValues.id;
      }else{
        return {error:"Устаревшие куки"};
      } 
    }else{ 
      return {error:"Старая версия куки"} 
    }
  }catch(e){ 
    return {error:"Недействительные куки"} 
  } 
}

function validateLogin(login){
  return /^[0-9a-zA-Z\_\.]{3,12}$/m.test(login)
}

function validatePassword(password){
  return /^.{8,64}$/m.test(password)
}


export default {
  authdata_encrypt,
  authdata_decrypt,
  validateLogin,
  validatePassword,
  
}