import { promises as fs } from 'fs';
export default async function() {
    for (const model of await fs.readdir("./models/")) {
        if (model === "connector.js") continue;
        db.define(model.slice(0,model.length-3), import("./"+model), {});
    }
}