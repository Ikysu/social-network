import { promises as fs } from 'fs';
export default async function*() {
    for (const model of await fs.readdir("./routers/")) {
        if (model === "connector.js") continue;
        yield {name:model.slice(0,model.length-3) ,model:(await import("./"+model)).default};
    }
}