import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
    const token = context.cookies.get('token')?.value;

    if (!token && context.url.pathname !== '/login') {
        return context.redirect('/login');
    }

    if (token && context.url.pathname === '/login') {
        return context.redirect('/dashboard');
    }

    return next();
});