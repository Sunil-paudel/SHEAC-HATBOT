import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    // Authentication disabled for "free for all" mode
    return NextResponse.next();
}

export const config = {
    matcher: ['/chat/:path*', '/api/conversations/:path*', '/api/messages/:path*'],
};
