import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { Sequelize } from "sequelize";
import connectorRouters from "./routers/connector.js";
import connectorModels from "./models/connector.js";

import fs from 'fs';

let settings = JSON.parse(fs.readFileSync("settings.json"));


(async()=>{

    let db = new Sequelize(`mysql://${settings.sequelize.user}:${settings.sequelize.pass}@${settings.sequelize.host}:${settings.sequelize.port}/${settings.sequelize.name}`)

    try {
        await db.authenticate();
        console.log('DB Connection has been established successfully.');
    } catch (error) {
        throw error;
    }

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
                console.log("/"+name+url)
                fastify[method]("/"+name+url, model[method][url])
            })
        })
    }

    await connectorModels()

    fastify.listen(settings.fastify,(err)=>{
        if(err) console.log(err)
        console.log("Server started")
    })
})()

