export default {
    get:{
        "/:id":async (req, reply)=>{
            console.log(db)
            return req.params.id
        }
    }
}