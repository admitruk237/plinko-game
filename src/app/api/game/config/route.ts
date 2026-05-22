import { NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function GET(): Promise<NextResponse> {
  const response = await fetch(`${API_BASE}/api/v1/game/config`);
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}
