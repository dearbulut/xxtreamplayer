import { NextResponse } from 'next/server';
import { getServerStreamUrl } from '@/lib/server-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const streamId = searchParams.get('stream_id');
  const streamType = searchParams.get('stream_type') as 'live' | 'movie' | 'series';

  if (!streamId || !streamType) {
    return NextResponse.json(
      { error: 'Stream ID and type are required' },
      { status: 400 }
    );
  }

  try {
    const streamUrl = await getServerStreamUrl(Number(streamId), streamType);
    return NextResponse.json({ url: streamUrl });
  } catch (error) {
    console.error('Error getting stream URL:', error);
    return NextResponse.json(
      { error: 'Failed to get stream URL' },
      { status: 500 }
    );
  }
}
