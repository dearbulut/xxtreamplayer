import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { clearServerActiveProfile } from '@/lib/server-profile';

export async function POST() {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await clearServerActiveProfile();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing active profile:', error);
        return NextResponse.json(
            { error: 'Failed to clear active profile' },
            { status: 500 }
        );
    }
}
