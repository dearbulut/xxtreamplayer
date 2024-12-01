import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProfileById, updateProfile } from '@/db/queries';
import { setServerActiveProfile } from '@/lib/server-profile';

export async function POST(request: Request) {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { profileId } = await request.json();

        // Get profile and verify ownership
        const profile = await getProfileById(profileId);
        if (!profile || profile.userId !== session.id) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        profile.isActive = true;
        // Update database
        await updateProfile(profile);

        // Set server-side active profile
        //await setServerActiveProfile(profile);

        // Return full profile data for client-side storage
        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error setting active profile:', error);
        return NextResponse.json(
            { error: 'Failed to set active profile' },
            { status: 500 }
        );
    }
}
