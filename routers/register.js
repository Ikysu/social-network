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

                        console.log(user.dataValues.id)
                        
                        await db.Account.create(
                            {
                                login: login,
                                password: password,
                                profile_id: user.dataValues.id
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
        }
    }
}