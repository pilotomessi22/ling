import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { app } from '@/server.ts';
import http from 'http';

describe('Ling Petshop Real Admin Server Integration Tests', () => {
  let server: http.Server;
  let baseUrl: string;
  const adminSecret = '26733089';

  before(async () => {
    process.env.ADMIN_SECRET_TOKEN = adminSecret;
    process.env.NODE_ENV = 'test';
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address() as any;
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('1. Invalid login returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' }),
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual((data as any).success, false);
  });

  it('2. Valid login returns success and sets ling_admin_session HttpOnly cookie', async () => {
    const res = await fetch(`${baseUrl}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminSecret }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual((data as any).success, true);

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie?.includes('ling_admin_session='));
    assert.ok(setCookie?.includes('HttpOnly'));
    assert.ok(setCookie?.includes('SameSite=Lax'));
  });

  it('3. GET /api/admin/session without cookie returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/session`);
    assert.strictEqual(res.status, 401);
  });

  it('4. GET /api/admin/session with valid session cookie returns authenticated true', async () => {
    // Login first to get cookie
    const loginRes = await fetch(`${baseUrl}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminSecret }),
    });
    const setCookie = loginRes.headers.get('set-cookie') || '';
    const cookieMatch = setCookie.match(/ling_admin_session=([^;]+)/);
    assert.ok(cookieMatch);
    const sessionCookie = `ling_admin_session=${cookieMatch[1]}`;

    const sessionRes = await fetch(`${baseUrl}/api/admin/session`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(sessionRes.status, 200);
    const data = await sessionRes.json();
    assert.strictEqual((data as any).authenticated, true);
  });

  it('5. Header tokens (x-admin-token, Authorization) do not grant access', async () => {
    const res = await fetch(`${baseUrl}/api/admin/session`, {
      headers: { 'x-admin-token': adminSecret },
    });
    assert.strictEqual(res.status, 401);

    const resAuth = await fetch(`${baseUrl}/api/admin/session`, {
      headers: { Authorization: `Bearer ${adminSecret}` },
    });
    assert.strictEqual(resAuth.status, 401);
  });

  it('6. POST /api/admin/logout invalidates session and clears cookie', async () => {
    const loginRes = await fetch(`${baseUrl}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminSecret }),
    });
    const setCookie = loginRes.headers.get('set-cookie') || '';
    const cookieMatch = setCookie.match(/ling_admin_session=([^;]+)/);
    const sessionCookie = `ling_admin_session=${cookieMatch![1]}`;

    const logoutRes = await fetch(`${baseUrl}/api/admin/logout`, {
      method: 'POST',
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(logoutRes.status, 200);

    const logoutCookie = logoutRes.headers.get('set-cookie');
    assert.ok(logoutCookie?.includes('Max-Age=0'));

    // Check session is now invalid
    const sessionRes = await fetch(`${baseUrl}/api/admin/session`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(sessionRes.status, 401);
  });

  it('7. Protected admin routes (e.g. /api/orders) block unauthenticated requests', async () => {
    const res = await fetch(`${baseUrl}/api/orders`);
    assert.strictEqual(res.status, 401);
  });
});
