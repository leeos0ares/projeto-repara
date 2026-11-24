import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protege as PÁGINAS privadas. As rotas /api não passam por aqui:
// cada rota da API confere a sessão por conta própria (a partir da Etapa 2).
export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const caminho = req.nextUrl.pathname;

    const soAdmin = caminho.startsWith("/usuarios");
    const soEquipe = caminho.startsWith("/clientes");

    if ((soAdmin && role !== "admin") || (soEquipe && role === "cliente")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // sem token = vai para /login
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ordens/:path*",
    "/clientes/:path*",
    "/equipamentos/:path*",
    "/usuarios/:path*",
  ],
};
