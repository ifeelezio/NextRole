import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ auth: { getUser } })),
}));

import { updateSession } from "@/lib/supabase/middleware";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
});

const run = (path: string) => updateSession(new NextRequest(`http://localhost${path}`));
const signedIn = () => getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
const signedOut = () => getUser.mockResolvedValue({ data: { user: null } });

describe("route protection", () => {
  it("redirects signed-out users from /dashboard and nested routes to /login", async () => {
    signedOut();
    for (const path of ["/dashboard", "/dashboard/upload", "/dashboard/analysis/abc"]) {
      const response = await run(path);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/login");
    }
  });

  it("lets signed-out users see public pages", async () => {
    signedOut();
    for (const path of ["/", "/login", "/signup"]) {
      expect((await run(path)).headers.get("location")).toBeNull();
    }
  });

  it("redirects signed-in users away from login and signup", async () => {
    signedIn();
    for (const path of ["/login", "/signup"]) {
      const response = await run(path);
      expect(response.headers.get("location")).toBe("http://localhost/dashboard");
    }
  });

  it("lets signed-in users reach the dashboard", async () => {
    signedIn();
    expect((await run("/dashboard")).headers.get("location")).toBeNull();
  });
});
