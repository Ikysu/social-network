export default {
    get:{
        "":async (req, reply)=>{
            let {login, password} = req.query
            if(!validateLogin(login)||!validatePassword(password)){
                req.status=400;
                return {error:"Неправильный логин или пароль"}
            }
            let check = await db.Account.findOne({
                where: {
                    login
                }
            })
            if (check) {
                if(check.password==password){
                    reply.header("set-cookie", authdata_encrypt({login, password}))
                    return {ok:true};
                }else{
                    reply.status=400;
                    return {error:'Неверный логин'}
                }
            } else {
                reply.status=400;
                return {error:'Аккаунта с таким логином не существует'}
            }
        }
    }
}