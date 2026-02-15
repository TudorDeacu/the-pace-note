"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        productsCount: 0,
        projectsCount: 0,
        articlesCount: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalOrders: 0
    });
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            // Count tables
            const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
            const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
            const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });

            // Fetch orders for analytics
            const { data: orders } = await supabase.from('orders').select('status, total_amount, created_at');

            let totalRevenue = 0;
            let pendingOrders = 0;
            const revenueByDate: Record<string, number> = {};
            const statusCounts: Record<string, number> = {
                pending: 0,
                processing: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0
            };

            if (orders) {
                orders.forEach(order => {
                    // Total Revenue & Pending
                    if (order.status !== 'cancelled') {
                        totalRevenue += Number(order.total_amount);
                    }
                    if (order.status === 'pending') {
                        pendingOrders++;
                    }

                    // Status counts
                    const status = order.status.toLowerCase();
                    if (statusCounts[status] !== undefined) {
                        statusCounts[status]++;
                    }

                    // Revenue by date (last 7 days typically, or all time aggregated by date)
                    const date = new Date(order.created_at).toLocaleDateString();
                    if (order.status !== 'cancelled') {
                        revenueByDate[date] = (revenueByDate[date] || 0) + Number(order.total_amount);
                    }
                });
            }

            // Transform for charts
            const revenueChartData = Object.keys(revenueByDate).map(date => ({
                date,
                amount: revenueByDate[date]
            })).slice(-7); // Last 7 days

            const statusChartData = Object.keys(statusCounts).map(status => ({
                name: status.charAt(0).toUpperCase() + status.slice(1),
                value: statusCounts[status]
            }));

            setStats({
                productsCount: productsCount || 0,
                projectsCount: projectsCount || 0,
                articlesCount: articlesCount || 0,
                pendingOrders,
                totalRevenue,
                totalOrders: orders?.length || 0
            });
            setRevenueData(revenueChartData);
            setStatusData(statusChartData);
            setLoading(false);
        }

        fetchStats();
    }, []);

    const COLORS = ['#FBBF24', '#60A5FA', '#3B82F6', '#34D399', '#EF4444'];

    if (loading) return <div className="text-white">Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter mb-8 text-white">Dashboard</h1>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Revenue</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.totalRevenue.toLocaleString()} RON</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Orders</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.totalOrders}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pending Orders</h3>
                    <p className="text-2xl font-bold text-red-500 mt-1">{stats.pendingOrders}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Products</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.productsCount}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Revenue Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '4px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: '#27272a' }}
                                />
                                <Bar dataKey="amount" fill="#DC2626" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Status Chart */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Order Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '4px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {statusData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs text-zinc-400 uppercase tracking-wider">{entry.name} ({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Garage Projects</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.projectsCount}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Blog Articles</h3>
                    <p className="text-2xl font-bold text-white mt-1">{stats.articlesCount}</p>
                </div>
            </div>
        </div>
    );
}
