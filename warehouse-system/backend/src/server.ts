import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3004);
const app = createApp();

app.listen(port, () => {
  console.log(`Warehouse API running at http://localhost:${port}`);
  console.log("Run frontend in /workspace/0316-1/warehouse-system/frontend (default: http://localhost:5004)");
});
