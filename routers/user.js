export default {
    get:{
        "/:id":async (req, reply)=>{
            let {id} = req.params
            let find = await db.User.findOne({
                where: {
                    id
                }
            })
            if(find){
                let {id, username, avatar, friends} = find.dataValues
                return {id, username, avatar, friends}
            }else{
                reply.status=404;
                return {error:"Пользователь не найден"}
            }
        },
        
        "/set":async (req, reply)=>{
            let user = await authdata_decrypt(req.headers.cookie);
            if(user.error){
                reply.status=400;
                return user
            }

            
            
            //let {id} = req.params
            //let find = await db.User.findOne({
            //    where: {
            //        id
            //    }
            //})
            //if(find){
            //    let {id, username, avatar, friends} = find.dataValues
            //    return {id, username, avatar, friends}
            //}else{
            //    reply.status=404;
            //    return {error:"Пользователь не найден"}
            //}

            return {ok:false}
        }
    }
}