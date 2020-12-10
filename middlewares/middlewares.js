import {send} from "../deps.js"

const errorMiddleware = async(context, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
}

const logMiddleware = async({ request, session }, next) => {
    let user_id = await session.get('user_id');
    if(!user_id) {
        user_id = 'anonymous';
    }

    const date = new Date();

    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${request.method} ${request.url.pathname} - ${ms} ms at ${date} by user: ${user_id}`);
}

const serveStaticFiles = async (context, next) => {
    if (context.request.url.pathname.startsWith('/static')) {
        const path = context.request.url.pathname.substring(7);
        await send(context, path, {
            root: `${Deno.cwd()}/static`
        });
    } else {
        await next();
    }
}

const checkAccessMiddleware = async ({request, session, response}, next) => {
    const path = request.url.pathname
    if(path === '/') {
        await next();
    } else if(path.includes('/api')) {
        await next();
    } else if(path.includes('/auth')) {
        await next();
    } else {
        
        //case comes here if user needs authentication
        if(await session.get('authenticated')) {
            await next();
        } else {
            response.redirect('/auth/login');
        }

    }
}


export { errorMiddleware, logMiddleware, serveStaticFiles, checkAccessMiddleware};