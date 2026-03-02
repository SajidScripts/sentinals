'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { Shield, Users, FolderOpen, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/v1/admin/stats'),
                    api.get('/v1/admin/users?limit=20'),
                ]);
                setStats(statsRes.data?.data || null);
                setUsers(usersRes.data?.data?.data || []);
            } catch {
                // User may not have admin access
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, router]);

    if (user?.role !== 'ADMIN') return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Logs', value: stats?.totalLogs || 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-muted-foreground">Platform-wide management</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-border bg-card">
                <div className="p-5 border-b border-border">
                    <h2 className="text-lg font-semibold">All Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Projects</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u: any) => (
                                <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4 text-muted-foreground">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{u._count?.projects || 0}</td>
                                    <td className="p-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
