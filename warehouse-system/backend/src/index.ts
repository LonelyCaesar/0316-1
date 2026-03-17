import { app } from './app.js';

const port = Number(process.env.PORT ?? 3004);
const host = process.env.HOST ?? '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Warehouse backend listening on http://${host}:${port}`);
});
