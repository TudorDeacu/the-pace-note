import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminOrders() {
    const supabase = await createClient();
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Orders</h1>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {!orders || orders.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 italic">
                        No orders found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6 uppercase tracking-wider">Order ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white uppercase tracking-wider">Total</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                                            {order.id.slice(0, 8)}...
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset uppercase tracking-wide
                                                ${order.status === 'delivered' ? 'bg-green-400/10 text-green-400 ring-green-400/20' :
                                                    order.status === 'shipped' ? 'bg-blue-400/10 text-blue-400 ring-blue-400/20' :
                                                        order.status === 'processing' ? 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20' :
                                                            order.status === 'cancelled' ? 'bg-red-400/10 text-red-400 ring-red-400/20' :
                                                                'bg-zinc-400/10 text-zinc-400 ring-zinc-400/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                            {order.total_amount} {order.currency || 'RON'}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Link href={`/admin/orders/${order.id}`} className="text-red-500 hover:text-red-400 uppercase tracking-widest font-bold text-xs">
                                                View<span className="sr-only">, {order.id}</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
