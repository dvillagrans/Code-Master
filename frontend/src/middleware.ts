import { defineMiddleware } from "astro:middleware";

// Función para validar el token con tu backend
async function validateToken(token: string) {
  try {
    const response = await fetch('http://localhost:8000/user/token/verify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Si la respuesta es exitosa (200), el token es válido
    return response.ok;
  } catch (error) {
    console.error('Error validando token:', error);
    return false;
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Obtener la ruta actual
  const pathname = context.url.pathname;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/signin', '/register'];
  
  // Rutas protegidas (prefijos de rutas que requieren autenticación)
  const protectedRoutePrefixes = ['/dashboard', '/profile', '/admin'];

  // Verificar si es una ruta pública
  if (publicRoutes.includes(pathname)) {
    return next();
  }

  // Verificar si la ruta actual comienza con algún prefijo protegido
  const isProtectedRoute = protectedRoutePrefixes.some(prefix => 
    pathname.startsWith(prefix)
  );

  // Obtener el token de las cookies
  const token = context.cookies.get('auth_token')?.value;
  
  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    return context.redirect('/login');
  }

  // Si hay token, validarlo
  if (token) {
    try {
      const isValidToken = await validateToken(token);
      
      // Si el token no es válido, redirigir al login
      if (!isValidToken) {
        // Opcional: limpiar la cookie de token
        context.cookies.delete('auth_token', { path: '/' });
        return context.redirect('/login');
      }
    } catch (error) {
      console.error('Error en validación de token:', error);
      return context.redirect('/login');
    }
  }

  // Si todo está bien, permitir el acceso
  return next();
});