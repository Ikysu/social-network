import { promises as fs } from 'fs';
export default async function() {
    for (const model of await fs.readdir("./models/")) {
        if (model === "connector.js") continue;
        import("./"+model);
    }
}