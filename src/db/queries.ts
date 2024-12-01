import { NewProfile, NewUser, Profile, profiles, User, users } from '@/db/schema';
import { db } from '@/db';
import { eq, ne } from 'drizzle-orm';

export const getProfileById = async (id: number) : Promise<Profile | null> => {   
    return await db.query.profiles.findFirst({  
        where: eq(profiles.id, id),
    }) ?? null;
}
export const getActiveProfileByUserId = async (userId: number) : Promise<Profile | null> => {   
    return await db.query.profiles.findFirst({  
        where: (
            eq(profiles.userId, userId),
            eq(profiles.isActive, true)
        ),
    }) ?? null;
}

export const getUser = async (email: string): Promise<User | null> => {
    return await db.query.users.findFirst({
        where: eq(users.email, email),
    }) ?? null;
}

export const createUser = async (user: NewUser) : Promise<never[]> => {
    return await db.insert(users).values(user);
}

export const getProfiles = async () : Promise<Profile[]> => {
    return await db.query.profiles.findMany();
}

export const createProfile = async (profile: NewProfile) => {
    return await db.insert(profiles).values(profile);
}

export const getProfilesByUserId = async (userId: number) : Promise<Profile[]> => {
    return await db.query.profiles.findMany({
        where: eq(profiles.userId, userId),
    });
}

export const deactivateOtherProfiles = async (userId: number, activeProfileId: number) => {
    return await db.update(profiles)
        .set({ isActive: false })
        .where(
            eq(profiles.userId, userId) && 
            ne(profiles.id, activeProfileId)  
        );
}

export const updateProfile = async (profile: Profile) => {
    if (profile.isActive) {
        // First, deactivate all other profiles for this user
        await deactivateOtherProfiles(profile.userId, profile.id);
    }
    
    return await db.update(profiles)
        .set({
            name: profile.name,
            iptvUrl: profile.iptvUrl,
            iptvUsername: profile.iptvUsername,
            iptvPassword: profile.iptvPassword,
            isActive: profile.isActive
        })
        .where(eq(profiles.id, profile.id));    
}

export const deleteProfile = async (profileId: number) => {
    return await db.delete(profiles)
        .where(eq(profiles.id, profileId));
}