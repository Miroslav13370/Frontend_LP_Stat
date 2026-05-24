import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SERVER_URL || "http://localhost:5001";

async function refreshAccessToken(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) return null;

  const response = await fetch(`${API_URL}/api/auth/updateToken`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (!response.ok) return null;

  return response;
}

function redirectWithClearedInstagramCookies(req: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/instagram/connect", req.url),
  );

  response.cookies.delete("instagramAccessToken");
  response.cookies.delete("instagramRefreshToken");

  return response;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const instagramAccessToken = req.cookies.get("instagramAccessToken")?.value;

  const isAuthPage = pathname.startsWith("/auth");
  const isInstagramAuthPage = pathname === "/instagram/connect";

  const isInstagramProtectedPage =
    pathname.startsWith("/instagram") && !isInstagramAuthPage;

  const isProtectedPage =
    pathname.startsWith("/moderator") || pathname.startsWith("/admin");

  if (isInstagramProtectedPage) {
    if (!instagramAccessToken) {
      return redirectWithClearedInstagramCookies(req);
    }

    const checkResponse = await fetch(`${API_URL}/api/instagram-auth/me`, {
      headers: {
        Cookie: `instagramAccessToken=${instagramAccessToken}`,
      },
    });

    if (!checkResponse.ok) {
      return redirectWithClearedInstagramCookies(req);
    }

    return NextResponse.next();
  }

  if (isInstagramAuthPage) {
    if (!instagramAccessToken) {
      return NextResponse.next();
    }

    const checkResponse = await fetch(`${API_URL}/api/instagram-auth/me`, {
      headers: {
        Cookie: `instagramAccessToken=${instagramAccessToken}`,
      },
    });

    if (!checkResponse.ok) {
      const response = NextResponse.next();

      response.cookies.delete("instagramAccessToken");
      response.cookies.delete("instagramRefreshToken");

      return response;
    }

    return NextResponse.redirect(new URL("/instagram/reports", req.url));
  }

  if (isProtectedPage) {
    if (accessToken) {
      return NextResponse.next();
    }

    const refreshResponse = await refreshAccessToken(req);

    if (!refreshResponse) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    const response = NextResponse.next();

    const setCookie = refreshResponse.headers.get("set-cookie");

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  }

  if (isAuthPage) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/moderator", req.url));
    }

    const refreshResponse = await refreshAccessToken(req);

    if (!refreshResponse) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL("/moderator", req.url));

    const setCookie = refreshResponse.headers.get("set-cookie");

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/moderator/:path*",
    "/admin/:path*",
    "/instagram/:path*",
  ],
};
