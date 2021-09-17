import express from "express";

import routes from "./routes";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.parse = (path: string) => {
    const keys = path.split(".");

    const key = keys.pop();
    const box = keys.reduce((object, key) => object[key], req);

    return [box, key];
  };
  next();
});

app.use(routes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (typeof err === "number") {
      return res.sendStatus(err);
    }

    const status = err?.status ?? 500;

    if (status === 500) {
      console.error(err);
    }

    res.status(status).send({ error: err?.message });
  }
);

export default app;
