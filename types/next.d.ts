// types/next.d.ts

/**
 * Extiende las definiciones de tipo de Next.js para solucionar:
 * 1. Problemas con NextResponse.json()
 * 2. Conflictos en el tipado de rutas API
 * 3. Compatibilidad con Next.js 15 y Prisma
 */

import 'next';
import 'next/server';

declare module 'next/server' {
  interface NextResponse<Body = any> {
    /**
     * Extensión del método json() para mejor tipado
     * Soluciona: "Type '{ __tag__: "GET"... }' does not satisfy the constraint"
     */
    json<T = any>(
      body?: T,
      init?: ResponseInit
    ): NextResponse<T> & {
      readonly headers: Headers;
      readonly ok: boolean;
      readonly redirected: boolean;
      readonly status: number;
      readonly statusText: string;
      readonly type: ResponseType;
      readonly url: string;
    };
  }
}

declare module 'next' {
  interface RouteHandler {
    /**
     * Tipado mejorado para métodos de ruta API
     * Soluciona problemas con parámetros en rutas dinámicas
     */
    GET?(
      request: Request,
      context: { params: Record<string, string | string[]> }
    ): Promise<Response>;

    POST?(
      request: Request,
      context: { params: Record<string, string | string[]> }
    ): Promise<Response>;

    PUT?(
      request: Request,
      context: { params: Record<string, string | string[]> }
    ): Promise<Response>;

    DELETE?(
      request: Request,
      context: { params: Record<string, string | string[]> }
    ): Promise<Response>;
  }

  /**
   * Extensión para el tipado de PageProps
   */
  interface PageProps<Params = {}, SearchParams = {}> {
    params: Params;
    searchParams: SearchParams;
  }
}

/**
 * Extensión para Prisma Client
 */
declare module '@prisma/client' {
  const PrismaClient: import('@prisma/client').PrismaClient;
  export default PrismaClient;
}