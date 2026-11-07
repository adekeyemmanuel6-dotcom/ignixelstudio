import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Guards /admin/*. The browser Supabase client (RLS-enforced) does the actual data access,
// so this is defence-in-depth on top of RLS: unauthenticated or non-staff users never receive admin pages.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const open = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return open ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();

  if (pathname === "/admin/reset-password") return response;
  if (!user) return open ? response : NextResponse.redirect(new URL("/admin/login", request.url));
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const staff = profile?.role === "admin" || profile?.role === "editor";
  if (!staff) {
    if (open) return response;
    const r = NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
    return r;
  }
  if (pathname === "/admin/login") return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}
export const config = { matcher: ["/admin/:path*"] };
