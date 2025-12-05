import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

// Convert JWT_SECRET to Uint8Array for jose
const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

/**
 * Verify and decode a JWT token using jose library (Edge Runtime compatible)
 */
export async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Map the JWT payload to our TokenPayload structure
    const userPayload: TokenPayload = {
      id: payload.id as string || payload.sub as string,
      email: payload.email as string,
      name: payload.name as string
    };
    
    return userPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get the current user from cookies in an Edge Runtime context
 */
export async function getUserFromRequestEdge(req: NextRequest): Promise<TokenPayload | null> {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    return await verifyTokenEdge(token);
  } catch (error) {
    return null;
  }
} 