'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import {
    FolderOpen,
    AlertTriangle,
    TrendingUp,
    Activity,
    Plus,
    ArrowUpRight,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
};

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projectsRes] = await Promise.all([
                    api.get('/v1/projects?limit=5').catch(() => ({ data: { data: { data: [], meta: { total: 0 } } } })),
                ]);
                setStats({
                    projects: projectsRes.data?.data || { data: [], meta: { total: 0 } },
                });
            } catch {
                // Use fallback data
                setStats({ projects: { data: [], meta: { total: 0 } } });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Projects',
            value: stats?.projects?.meta?.total || 0,
            icon: FolderOpen,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Active Monitors',
            value: stats?.projects?.data?.filter((p: any) => p.status === 'ACTIVE').length || 0,
            icon: Activity,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            title: 'Alerts Today',
            value: 0,
            icon: AlertTriangle,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
        },
        {
            title: 'Uptime',
            value: '99.9%',
            icon: TrendingUp,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s an overview of your monitoring infrastructure
                    </p>
                </div>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Projects */}
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                <div className="rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h2 className="text-lg font-semibold">Recent Projects</h2>
                        <Link
                            href="/dashboard/projects"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {stats?.projects?.data?.length === 0 ? (
                        <div className="p-6 pt-2 text-center">
                            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground text-sm">No projects yet</p>
                            <Link
                                href="/dashboard/projects/new"
                                className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Create your first project
                            </Link>
                        </div>
                    ) : (
                        <div className="px-6 pb-6 space-y-3">
                            {stats?.projects?.data?.slice(0, 5).map((project: any) => (
                                <Link
                                    key={project.id}
                                    href={`/dashboard/projects/${project.id}`}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${project.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                        <div>
                                            <p className="font-medium text-sm">{project.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {project._count?.logs || 0} logs · {project.status.toLowerCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
