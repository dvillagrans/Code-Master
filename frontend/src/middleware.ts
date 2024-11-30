import { defineMiddleware } from "astro:middleware";

async function validateToken(token: string) {
  try {
    const response = await fetch('http://localhost:8000/user/token/verify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error('Token validation failed:', await response.text());
      return { valid: false };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating token:', error);
    return { valid: false };
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  const publicRoutes = ['/', '/signin', '/register'];
  const protectedRoutePrefixes = ['/dashboard', '/profile', '/admin'];

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return next();
  }

  const isProtectedRoute = protectedRoutePrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

  const token = context.cookies.get('auth_token')?.value;

  if (isProtectedRoute && !token) {
    console.log('No token, redirecting to signin');
    return context.redirect('/signin', 302);
  }

  if (token) {
    const tokenValidation = await validateToken(token);

    if (!tokenValidation.valid) {
      console.log('Invalid token, redirecting to signin');
      context.cookies.delete('auth_token', { path: '/' });
      return context.redirect('/signin', 302);
    }
  }

  return next();
});
