import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const NGINX_SECRET = process.env.NGINX_SECRET_TOKEN

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow Next internals & static
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 🚀 SKIP nginx validation on Vercel
  if (process.env.VERCEL === '1') {
    return NextResponse.next()
  }

  // 🔒 Enforce nginx-only access (NON-Vercel deployments)
  const nginxSecret = request.headers.get('x-nginx-secret')

  if (!NGINX_SECRET || nginxSecret !== NGINX_SECRET) {
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden - Direct access not allowed' }),
      {
        status: 403,
        headers: { 'content-type': 'application/json' }
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// // This should match the secret in Nginx config and .env
// const NGINX_SECRET = process.env.NGINX_SECRET_TOKEN;

// export function middleware(request: NextRequest) {
//   // Skip middleware for static files and Next.js internals
//   const { pathname } = request.nextUrl;
  
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/static') ||
//     pathname.includes('.')
//   ) {
//     return NextResponse.next();
//   }

//   // 1. Verify request comes from Nginx
//   const nginxSecret = request.headers.get('x-nginx-secret');
  
//   if (!NGINX_SECRET || nginxSecret !== NGINX_SECRET) {
//     console.error('🚨 Unauthorized direct access attempt blocked:', {
//       ip: request.headers.get('x-real-ip') || 'unknown',
//       url: request.url,
//       userAgent: request.headers.get('user-agent'),
//       timestamp: new Date().toISOString()
//     });
    
//     return new NextResponse(
//       JSON.stringify({ error: 'Forbidden - Direct access not allowed' }), 
//       { 
//         status: 403,
//         headers: { 'content-type': 'application/json' }
//       }
//     );
//   }

//   // 2. Validate host header
//   const host = request.headers.get('host');
//   const allowedHosts = [
//     'codebazeacademy.com', 
//     'www.codebazeacademy.com',
//     'localhost:3000' // for local testing
//   ];
  
//   if (host && !allowedHosts.some(h => host.includes(h))) {
//     console.error('🚨 Invalid host header:', host);
//     return new NextResponse('Invalid Host', { status: 403 });
//   }

//   // 3. Block suspicious patterns in URL
//   const suspiciousPatterns = [
//     /\.\./,           // Directory traversal
//     /eval\(/i,
//     /exec\(/i,
//     /system\(/i,
//     /<script/i,
//     /javascript:/i,
//     /on\w+\s*=/i,    // Event handlers like onclick=
//     /import\(/i,
//     /require\(/i
//   ];

//   if (suspiciousPatterns.some(pattern => pattern.test(pathname))) {
//     console.error('🚨 Suspicious URL pattern detected:', pathname);
//     return new NextResponse('Bad Request', { status: 400 });
//   }

//   // 4. Log legitimate requests (optional, for monitoring)
//   const ip = request.headers.get('x-real-ip') || 'unknown';
//   console.log(`✅ Request from ${ip}: ${request.method} ${pathname}`);

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public files (public folder)
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };