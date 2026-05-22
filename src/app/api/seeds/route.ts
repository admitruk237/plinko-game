import { type NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function GET(): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE}/api/v1/seeds/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'client') {
    const body = await req.json();
    const response = await fetch(`${API_BASE}/api/v1/seeds/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 204) {
      return NextResponse.json(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  if (action === 'rotate') {
    const body = await req.json();
    const response = await fetch(`${API_BASE}/api/v1/seeds/rotate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
