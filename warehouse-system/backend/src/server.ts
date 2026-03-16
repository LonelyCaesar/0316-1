import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3004);
const host = process.env.HOST || "0.0.0.0";

const app = createApp();

app.listen(port, host, () => {
  console.log(`Warehouse API running at http://localhost:${port}`);
  console.log(`Listening on ${host}:${port}`);
});
