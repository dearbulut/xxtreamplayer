'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, NewProfile } from '@/db/schema';
import { getClientSession } from '@/lib/client-auth';
import { Check, Trash2 } from "lucide-react";

interface ProfileFormData extends Omit<NewProfile, 'id' | 'userId' | 'createdAt'> {}

interface Session {
    id: number;
    email: string;
}

export default function Profiles() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeProfileId, setActiveProfileId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [user, setUser] = useState<Session | null>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        iptvUrl: '',
        iptvUsername: '',
        iptvPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const initializeUser = async () => {
            const session = await getClientSession();
            console.log(session);
            if (session) {
                setUser(session);
                await fetchProfiles();
            } else {
                router.push('/login');
            }
        };
        
        initializeUser();
    }, [router]);

    const fetchProfiles = async () => {
        try {
            const response = await fetch('/api/profiles', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            const data = await response.json();
            console.log(data);
            setProfiles(data);
            setActiveProfileId(data.activeProfileId);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user?.id
                }),
            });

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            if (response.ok) {
                setIsDialogOpen(false);
                setFormData({
                    name: '',
                    iptvUrl: '',
                    iptvUsername: '',
                    iptvPassword: '',
                });
                await fetchProfiles();
            }
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    };

    const setActiveProfile = async (profileId: number) => {
        try {
            const response = await fetch('/api/profiles/setActive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ profileId }),
            });

            if (response.status === 401) {
                router.push('/login');
                return;
            }

            if (response.ok) {
                setActiveProfileId(profileId);
            }
        } catch (error) {
            console.error('Error setting active profile:', error);
        }
    };

    const deleteProfile = async (profileId: number) => {
        try {
            const response = await fetch(`/api/profiles/${profileId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to delete profile');
                return;
            }

            await fetchProfiles();
        } catch (error) {
            console.error('Error deleting profile:', error);
            setError('Failed to delete profile');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Profiles</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Profile</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new IPTV profile.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="hidden" name="userId" value={user?.id} />
                            <div className="space-y-2">
                                <Label htmlFor="name">Profile Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iptvUrl">IPTV URL</Label>
                                <Input
                                    id="iptvUrl"
                                    name="iptvUrl"
                                    value={formData.iptvUrl}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iptvUsername">IPTV Username</Label>
                                <Input
                                    id="iptvUsername"
                                    name="iptvUsername"
                                    value={formData.iptvUsername}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iptvPassword">IPTV Password</Label>
                                <Input
                                    id="iptvPassword"
                                    name="iptvPassword"
                                    type="password"
                                    value={formData.iptvPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Add Profile</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles && profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className={`p-4 rounded-lg border ${profile.isActive ? 'border-green-500' : 'border-gray-200'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{profile.name}</h3>
                            {profile.isActive && (
                                <Check className="h-5 w-5 text-green-500" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500 mb-4">URL: {profile.iptvUrl}</p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setActiveProfile(profile.id)}
                                    variant={profile.isActive ? "secondary" : "outline"}
                                    className="flex-1"
                                >
                                    {profile.isActive ? 'Active' : 'Set Active'}
                                </Button>
                                {!profile.isActive && (
                                    <Button
                                        onClick={() => deleteProfile(profile.id)}
                                        variant="destructive"
                                        size="icon"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}