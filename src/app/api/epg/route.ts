import { NextResponse } from 'next/server';
import { fetchFromServerApi } from '@/lib/server-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stream_id = searchParams.get('stream_id');

  if (!stream_id) {
    return NextResponse.json(
      { error: 'Channel ID is required' },
      { status: 400 }
    );
  }

  try {
    const epgData = await fetchFromServerApi('get_simple_data_table', {
      stream_id: stream_id
    });

    return NextResponse.json(epgData);
  } catch (error) {
    console.error('Error fetching EPG data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch EPG data' },
      { status: 500 }
    );
  }
}
