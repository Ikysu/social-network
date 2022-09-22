import fs from 'fs';
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { Sequelize } from "sequelize";
import connectorRouters from "./routers/connector.js";
import connectorModels from "./models/connector.js";

import noUpdate from 'sequelize-noupdate-attributes';

global.settings = JSON.parse(fs.readFileSync("settings.json"));

console._log=console.log
console.log=(...text)=>{
    if(settings.debug.info) console._log(...text)
}

// Подключаем общие функции
import publicFunctions from "./public.functions.js";
Object.keys(publicFunctions).forEach(key=>{
    global[key]=publicFunctions[key];
});



(async()=>{

    // Создаем класс базы
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
    noUpdate(global._db)

    // Авторизуемся в базу
    try {
        await _db.authenticate();
        console.log('DB Connected');
    } catch (error) {
        throw error;
    }

    // Создаем глобальный обьект, дабы сократить
    global.db = _db.models

    // Подключаем модели для Sequelize из папки models
    await connectorModels();
    console.log("DB Models connected")

    // Синхронизируем базу (force - сносит все | alter - добавляет или удаляет столбцы) 
    _db.sync({ force: true });





    

    // Поднимаем сервер
    let fastify = Fastify({
        logger:settings.debug.fastify
    });

    // Корс для всех доменов
    fastify.register(fastifyCors, { 
        methods:["POST", "GET"],
        origin:"*" 
    })

    // Статика для пикч
    fastify.register(fastifyStatic,{
        root:"/var/www/social-network/static",
        prefix: '/static/'
    })

    // Подключаем все роуты для веб сервера из папки routers
    for await (const md of connectorRouters()){
        var {model, name} = md;
        if(model) Object.keys(model).forEach(method=>{
            if(model[method]) Object.keys(model[method]).forEach(url=>{
                console.log("Set router:","/"+name+url)
                fastify[method]("/"+name+url, model[method][url])
            })
        })
    }

    // Начинаем слушать порты
    fastify.listen(settings.fastify,(err)=>{
        if(err) console.log(err)
        console.log("Server started")
    })
})()

