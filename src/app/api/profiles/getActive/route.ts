import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getServerActiveProfile } from '@/lib/server-profile';

export async function GET() {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const activeProfile = await getServerActiveProfile();
        
        if (!activeProfile) {
            return NextResponse.json(null);
        }

        // Verify profile ownership
        if (activeProfile.userId !== session.id) {
            return NextResponse.json(null);
        }

        return NextResponse.json(activeProfile);
    } catch (error) {
        console.error('Error getting active profile:', error);
        return NextResponse.json(
            { error: 'Failed to get active profile' },
            { status: 500 }
        );
    }
}
