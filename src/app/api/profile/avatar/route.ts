import { type NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const incoming = await req.formData();
  const image = incoming.get('image');
  if (!(image instanceof File)) {
    return NextResponse.json({ error: 'Missing avatar image' }, { status: 400 });
  }

  const forwarded = new FormData();
  forwarded.append('image', image, image.name);

  const response = await fetch(`${API_BASE}/api/v1/profile/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: forwarded,
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}
