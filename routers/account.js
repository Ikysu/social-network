export default {
    get:{
        "/register":async (req, reply)=>{
            let {login, password} = req.query
            if(!validateLogin(login)||!validatePassword(password)){
                reply.status=400;
                return {error:"Неправильный логин или пароль"}
            }
            let check = await db.Account.findOne({
                where: {
                    login: login,
                }
            })
            if (!check) {
                try {
                    await _db.transaction(async (t) => {
                        const transactionHost = { transaction: t };
            
                        const user = await db.User.create(
                            {
                                username: login,
                                avatar: settings.static.url + 'base.webp',
                                friends: []
                            },
                            transactionHost
                        );
                        
                        await db.Account.create(
                            {
                                login: login,
                                password: password,
                                pid: user.dataValues.pid
                            },
                            transactionHost
                        );
                    });
                    reply.header("set-cookie", authdata_encrypt({login, password}))
                    return {ok:true};
                } catch (e) {
                    console.log('[TRANSACTION ERROR] ' + e);
                    reply.status=500;
                    return {error:'Ошибка при выполнении транзакции'}
                }
            } else {
                reply.status=400;
                return {error:'Аккаунт с таким логином уже существует'}
            }
        },
        "/login":async (req, reply)=>{
            let {login, password} = req.query
            if(!validateLogin(login)||!validatePassword(password)){
                reply.status=400;
                return {error:"Неправильный логин или пароль"}
            }
            let check = await db.Account.findOne({
                where: {
                    login
                }
            })
            if (check) {
                console.log("check", check)
                if(check.dataValues.password==password){
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