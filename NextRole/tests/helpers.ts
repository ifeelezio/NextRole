import { vi, type Mock } from "vitest";

interface QueryResult {
  data: unknown;
  error: unknown;
}

interface Chain {
  select: Mock;
  eq: Mock;
  insert: Mock;
  maybeSingle: Mock;
  single: Mock;
}

interface MockOptions {
  user: { id: string } | null;
  selectResult?: QueryResult; // result of .maybeSingle()
  insertResult?: QueryResult; // result of .insert(...).select().single()
}

/** A minimal chainable stand-in for the Supabase client. */
export function mockSupabase({ user, selectResult, insertResult }: MockOptions) {
  const empty: QueryResult = { data: null, error: null };
  const chain: Chain = {
    select: vi.fn(),
    eq: vi.fn(),
    insert: vi.fn(),
    maybeSingle: vi.fn(async () => selectResult ?? empty),
    single: vi.fn(async () => insertResult ?? empty),
  };
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);

  const client = {
    auth: { getUser: vi.fn(async () => ({ data: { user }, error: null })) },
    from: vi.fn(() => chain),
  };
  return { client, chain };
}

export function jsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
