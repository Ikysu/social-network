
var avalibleEditParams = ["username", "avatar"];


export default {
    get:{
        "/:pid":async (req, reply)=>{
            let {pid} = req.params
            let find = await db.User.findOne({
                where: {
                    pid
                }
            })
            if(find){
                let {pid, username, avatar, friends} = find.dataValues
                return {pid, username, avatar, friends}
            }else{
                reply.status=404;
                return {error:"Пользователь не найден"}
            }
        },
        "/set/list":async (req, reply)=>{
            return avalibleEditParams
        }
    },
    post:{
        "/set":async (req, reply)=>{
            let user = await authdata_decrypt(req.headers.cookie);
            if(user.error){
                reply.status=400;
                return user
            }

            console.log("WHERE", user)

            var avalibleEditParams = ["username", "avatar"];

            if(req.body instanceof Object&&!(req.body instanceof Array)){
                var callUpdate = {}
                Object.keys(req.body).forEach(key=>{
                    if(avalibleEditParams.indexOf(key)!=-1){
                        switch (key) {
                            case "username":
                                if(validateUsername(req.body[key])){
                                    callUpdate.username=req.body[key]
                                }
                                break;

                            case "avatar":
                                //if(validateUsername(req.body[key])){
                                //    callUpdate.username=req.body[key]
                                //}
                                break;
                        }
                    }
                })
                let usr = await db.User.findOne({where:user})
                if(usr){
                    let upd = await usr.update(callUpdate)
                    if(upd){
                        return {ok:true}
                    }else{
                        reply.status = 500
                        return {error: "Ошибка при выполнении запроса"}
                    }
                }else{
                    reply.status = 400
                    return {error:"Пользователь не найден"}
                }
            }else{
                reply.status = 400
                return {error:`Тело запроса не является объектом`}
            }
        }
    }
}