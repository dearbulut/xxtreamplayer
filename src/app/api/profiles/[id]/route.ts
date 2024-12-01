import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { deleteProfile, getProfileById } from '@/db/queries';

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    const { id } = await context.params;
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const profileId = parseInt(id);
        const profile = await getProfileById(profileId);

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Don't allow deleting active profiles
        if (profile.isActive) {
            return NextResponse.json(
                { error: 'Cannot delete active profile. Please set another profile as active first.' }, 
                { status: 400 }
            );
        }

        await deleteProfile(profileId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting profile:', error);
        return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
    }
}
