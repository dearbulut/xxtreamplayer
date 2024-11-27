export async function fetchFromClientApi(action: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams({
    action,
    ...params,
  })

  const response = await fetch(`/api/iptv?${searchParams.toString()}`)
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getClientStreamUrl(streamId: string, streamType: 'live' | 'movie' | 'series') {
  const data = await fetchFromClientApi('get_stream_url', {
    stream_id: streamId,
    type: streamType,
  })
  return data.url
}
