import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUser, getProfilesByUserId, createProfile } from '@/db/queries';

export async function GET() {
    const session = await getSession();
    //console.log(session);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        
        const profiles = await getProfilesByUserId(session?.id || 0);
        console.log("profs: "+profiles);
        return NextResponse.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profiles' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, iptvUsername, iptvPassword, iptvUrl, isActive, userId } = await request.json();
        
        const newProfile = await createProfile({
            name,
            iptvUsername,
            iptvPassword,
            userId: session.user?.id || userId,
            iptvUrl,
            isActive
        });

        return NextResponse.json(newProfile);
    } catch (error) {
        console.error('Error creating profile:', error);
        return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
        );
    }
}
