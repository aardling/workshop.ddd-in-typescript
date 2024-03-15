import express from "express";
import { routes } from "./router";

const app = express();
const port = 5000;

app.use(routes);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
