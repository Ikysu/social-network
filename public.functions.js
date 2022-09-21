
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

function validateLogin(login){
  return /^[0-9a-zA-Z\_\.]{3,12}$/m.test(login)
}

function validatePassword(password){
  return /^.{8,64}$/m.test(password)
}


export default {
  authdata_encrypt,
  validateLogin,
  validatePassword
}