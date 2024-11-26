import { NextResponse } from 'next/server';
import axios from 'axios';

import { XMLParser } from 'fast-xml-parser';

const IPTV_BASE_URL = '***REMOVED***'
const IPTV_USERNAME = '***REMOVED***'
const IPTV_PASSWORD = '***REMOVED***'

export async function GET() {
  try {
    const epgUrl = `${IPTV_BASE_URL}/xmltv.php?username=${IPTV_USERNAME}&password=${IPTV_PASSWORD}`;
    const response = await axios.get(epgUrl);
    
    // Parse XML to JSON
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_"
    });
    const jsonData = parser.parse(response.data);
    
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('EPG fetch error:', error);
    return new Response('Failed to fetch EPG data', { status: 500 });
  }
}
