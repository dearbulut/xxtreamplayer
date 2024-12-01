import { NextResponse } from 'next/server'
import { fetchFromApi, getStreamUrl } from '@/lib/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const params = Object.fromEntries(searchParams.entries())
  
  // Remove action from params as it's handled separately
  delete params.action
  
  try {
    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 })
    }

    if (action === 'get_stream_url') {
      const streamId = parseInt(params.stream_id)
      const streamType = params.type as 'live' | 'movie' | 'series'
      
      if (!streamId || !streamType) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
      }

      const url = await getStreamUrl(streamId, streamType)
      return NextResponse.json({ url })
    }

    const data = await fetchFromApi(action, params)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from IPTV service' },
      { status: 500 }
    )
  }
}
