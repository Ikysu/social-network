import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { Sequelize } from "sequelize";
import connectorRouters from "./routers/connector.js";

import fs from 'fs';

let settings = JSON.parse(fs.readFileSync("settings.json"));


(async()=>{
    let fastify = Fastify({
        logger:settings.debug.fastify
    });
    fastify.register(fastifyCors, { 
        methods:["POST", "GET"],
        origin:"*" 
    })

    fastify.register(fastifyStatic,{
        root:"/var/www/social-network/static",
        prefix: '/static/'
    })

    for await (const md of connectorRouters()){
        var {model, name} = md;
        Object.keys(model).forEach(method=>{
            Object.keys(model[method]).forEach(url=>{
                fastify[method]("/"+name+url, model[method][url])
            })
        })
    }

    fastify.listen(settings.fastify)

})()

