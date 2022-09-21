import fs from 'fs';
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { Sequelize } from "sequelize";
import connectorRouters from "./routers/connector.js";
import connectorModels from "./models/connector.js";

import publicFunctions from "./public.functions.js";

Object.keys(publicFunctions).forEach(key=>{
    global[key]=publicFunctions[key];
})

global.settings = JSON.parse(fs.readFileSync("settings.json"));

console._log=console.log
console.log=(...text)=>{
    if(settings.debug.info) console._log(...text)
}


(async()=>{

    var dbConf = {
        define: {
            freezeTableName: true
        }
    }
    if(settings.debug.sequelize) {
        dbConf.logging=console.log
    }else{
        dbConf.logging=false
    }
    global._db = new Sequelize(`mysql://${settings.sequelize.user}:${settings.sequelize.pass}@${settings.sequelize.host}:${settings.sequelize.port}/${settings.sequelize.name}`, dbConf)

    try {
        await _db.authenticate();
        console.log('DB Connected');
    } catch (error) {
        throw error;
    }

    global.db = _db.models

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
        if(model) Object.keys(model).forEach(method=>{
            if(model[method]) Object.keys(model[method]).forEach(url=>{
                console.log("Set router:","/"+name+url)
                fastify[method]("/"+name+url, model[method][url])
            })
        })
    }

    await connectorModels();
    console.log("DB Models connected")

    _db.sync({ force: true });

    fastify.listen(settings.fastify,(err)=>{
        if(err) console.log(err)
        console.log("Server started")
    })
})()

