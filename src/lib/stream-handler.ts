import ffmpeg from 'fluent-ffmpeg';
import NodeCache from 'node-cache';
import { createWriteStream } from 'fs';
import { mkdir, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

// Cache to store stream processing status and paths
const streamCache = new NodeCache({
  stdTTL: 3600, // 1 hour cache
  checkperiod: 600, // Check for expired entries every 10 minutes
});

const HLS_SEGMENT_DURATION = 4; // seconds
const OUTPUT_DIR = join(process.cwd(), 'public', 'streams');

interface StreamInfo {
  status: 'processing' | 'ready' | 'error';
  playlistPath?: string;
  error?: string;
}

export async function ensureOutputDir() {
  try {
    await access(OUTPUT_DIR, constants.F_OK);
  } catch {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }
}

export async function processStream(streamUrl: string, streamId: string): Promise<StreamInfo> {
  // Check cache first
  const cached = streamCache.get<StreamInfo>(streamId);
  if (cached) return cached;

  const outputPath = join(OUTPUT_DIR, streamId);
  const playlistPath = `/streams/${streamId}/playlist.m3u8`;
  const segmentPath = `/streams/${streamId}/segment_%d.ts`;

  try {
    await ensureOutputDir();
    await mkdir(join(OUTPUT_DIR, streamId), { recursive: true });

    // Set initial status with explicit type
    const initialStatus: StreamInfo = { status: 'processing' };
    streamCache.set(streamId, initialStatus);

    // Start FFmpeg process
    await new Promise((resolve, reject) => {
      ffmpeg(streamUrl)
        .outputOptions([
          '-c:v copy', // Copy video codec
          '-c:a copy', // Copy audio codec
          '-f hls', // Force HLS output
          `-hls_time ${HLS_SEGMENT_DURATION}`, // Segment duration
          '-hls_list_size 6', // Keep 6 segments in playlist
          '-hls_flags delete_segments+append_list', // Delete old segments and append to list
          '-hls_segment_type mpegts', // Use MPEGTS segments
          '-hls_base_url', `/streams/${streamId}/`, // Add base URL for segments
          '-hls_segment_filename', join(outputPath, 'segment_%d.ts'), // Local path for segments
        ])
        .output(join(outputPath, 'playlist.m3u8'))
        .on('start', (commandLine) => {
          console.log('FFmpeg started with command:', commandLine);
        })
        .on('end', () => {
          console.log('FFmpeg processing finished');
          const readyStatus: StreamInfo = { status: 'ready', playlistPath };
          streamCache.set(streamId, readyStatus);
          resolve(null);
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          const errorStatus: StreamInfo = { status: 'error', error: err.message };
          streamCache.set(streamId, errorStatus);
          reject(err);
        })
        .run();
    });

    return { status: 'ready', playlistPath };
  } catch (error) {
    console.error('Stream processing error:', error);
    const errorStatus: StreamInfo = { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
    streamCache.set(streamId, errorStatus);
    return errorStatus;
  }
}

export function getStreamStatus(streamId: string): StreamInfo | null {
  return streamCache.get(streamId) || null;
}
