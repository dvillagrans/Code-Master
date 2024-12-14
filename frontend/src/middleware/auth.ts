export function isAdmin(Astro: any) {
  const session = Astro.cookies.get('session')?.json();
  
  if (!session || session.role !== 'admin') {
    return Astro.redirect('/login');
  }

  return true;
}
