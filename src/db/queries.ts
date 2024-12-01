import { NewProfile, NewUser, Profile, profiles, User, users } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export const getProfileById = async (id: number) : Promise<Profile | null> => {   
    return await db.query.profiles.findFirst({  
        where: eq(profiles.id, id),
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

export const updateProfile = async (profile: Profile) => {
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