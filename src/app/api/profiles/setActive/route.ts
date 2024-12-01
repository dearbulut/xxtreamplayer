import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProfileById, updateProfile } from '@/db/queries';

export async function POST(request: Request) {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { profileId } = await request.json();

        // First, set all profiles for this user to inactive
        const profile = await getProfileById(profileId)

        // Then set the selected profile as active
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        profile.isActive = true;
        await updateProfile(profile);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting active profile:', error);
        return NextResponse.json(
            { error: 'Failed to set active profile' },
            { status: 500 }
        );
    }
}
