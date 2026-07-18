import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force Node.js runtime — Edge Runtime is not supported in Vercel Services
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith('/admin') || 
                            pathname.startsWith('/doctor') || 
                            pathname.startsWith('/asha');

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Decoding payload part of JWT token: Header.Payload.Signature
            const payloadBase64 = token.split('.')[1];
            if (!payloadBase64) {
                throw new Error("Invalid token format");
            }
            
            // Decrypt base64 at edge context
            const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
            const payload = JSON.parse(payloadJson);
            const role = payload.role;

            // Route protection rules matching roles
            if (pathname.startsWith('/admin') && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
            if (pathname.startsWith('/doctor') && role !== 'doctor') {
                return NextResponse.redirect(new URL('/', request.url));
            }
            if (pathname.startsWith('/asha') && role !== 'asha') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (err) {
            console.error("Auth middleware error:", err);
            // Clear bad cookie and redirect
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete("token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/doctor/:path*',
        '/asha/:path*',
    ],
};
