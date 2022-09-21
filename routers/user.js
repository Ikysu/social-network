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
        
        "/set/username":async (req, reply)=>{
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