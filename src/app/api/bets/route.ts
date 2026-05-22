import { type NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const response = await fetch(`${API_BASE}/api/v1/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();
  const limit = searchParams.get('limit');
  const cursor = searchParams.get('cursor');
  const rows = searchParams.get('rows');

  if (limit) params.set('limit', limit);
  if (cursor) params.set('cursor', cursor);
  if (rows) params.set('rows', rows);

  const response = await fetch(`${API_BASE}/api/v1/bets?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}
