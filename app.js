import { Application } from "./deps.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js"
import * as middleware from './middlewares/middlewares.js';
import { router } from "./routes/routes.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);

app.use(router.routes());

app.listen({ port: 7777 });