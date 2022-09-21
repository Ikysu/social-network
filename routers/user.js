export default {
    get:{
        ":id":async (req, reply)=>{
            return req.params.id
        }
    }
}