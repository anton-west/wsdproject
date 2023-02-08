import { Application } from "./deps.js";
import { viewEngine, dejsEngine, oakAdapter } from "./deps.js"
import * as middleware from './middlewares/middlewares.js';
import { router } from "./routes/routes.js";
import { Session } from "./deps.js"
import { oakCors } from "./deps.js";

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

const app = new Application();

//const ejsEngine = engineFactory.getEjsEngine();
//const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, dejsEngine, {
    viewRoot: "./views"
}));

// Apply sessions to your Oak application.
// You can also apply the middleware to specific routes instead of the whole app.
// Without params, default MemoryStore is used. See the Storage chapter below for more info.
app.use(Session.initMiddleware())

app.use(oakCors());

app.use(middleware.errorMiddleware);
app.use(middleware.logMiddleware);
app.use(middleware.serveStaticFiles);
app.use(middleware.checkAccessMiddleware);

app.use(router.routes());

app.listen({ port: port });