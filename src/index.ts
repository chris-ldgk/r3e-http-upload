import { Hono } from 'hono'
import {resolve} from 'node:path';
import {write} from 'bun';
import {mkdir} from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
    },
    host: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});



const app = new Hono()

app.post("/upload/:server/:file", async (c) => {
  const {server, file} = c.req.param()
  const serverPath = resolve(process.cwd(), "results", server);
  if (!existsSync(serverPath)) {
    await mkdir(serverPath, {recursive: true})
  }
  const body = await c.req.json();
  await write(resolve(serverPath, file), JSON.stringify(body, null, 2));
  return c.text("Success", 200)
})

const port = Number(values.port) || 3000;
const host = values.host || 'localhost';

export default {
  fetch: app.fetch,
  port,
  host,
}