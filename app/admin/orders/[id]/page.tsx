"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
    product_image?: string;
}

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    currency: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: any;
    items?: OrderItem[];
}

export default function OrderDetails() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchOrder() {
            if (!params?.id) return;

            // Fetch order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', params.id)
                .single();

            if (orderError) {
                console.error("Error fetching order:", orderError);
                return;
            }

            setOrder(orderData);

            // Fetch items
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', params.id);

            if (itemsData) {
                setItems(itemsData);
            }

            setLoading(false);
        }
        fetchOrder();
    }, [params?.id]);

    const updateStatus = async (newStatus: string) => {
        if (!order) return;
        setUpdating(true);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', order.id);

        if (error) {
            alert("Error updating status");
        } else {
            setOrder({ ...order, status: newStatus });
        }
        setUpdating(false);
    };

    if (loading) return <div className="text-white">Loading order...</div>;
    if (!order) return <div className="text-white">Order not found</div>;

    return (
        <div className="pb-20">
            <Link href="/admin/orders" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Orders
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Order #{order.id.slice(0, 8)}</h1>
                            <p className="text-zinc-500 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-400 text-sm uppercase font-bold tracking-wider mr-2">Status:</span>
                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(e.target.value)}
                                disabled={updating}
                                className="bg-zinc-900 border border-zinc-800 text-white text-sm rounded p-2 outline-none focus:border-red-600 uppercase font-bold tracking-wider"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Product</th>
                                    <th className="py-3 px-6 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Price</th>
                                    <th className="py-3 px-6 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Quantity</th>
                                    <th className="py-3 px-6 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800 text-zinc-300 text-sm">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                {item.product_image && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.product_image} alt="" className="h-10 w-10 rounded object-cover bg-zinc-800" />
                                                )}
                                                <span className="font-medium text-white">{item.product_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">{item.price_at_purchase} {order.currency || 'RON'}</td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">{item.quantity}</td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap font-medium text-white">
                                            {item.price_at_purchase * item.quantity} {order.currency || 'RON'}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-zinc-800/30 font-bold">
                                    <td colSpan={3} className="py-4 px-6 text-right text-white uppercase tracking-wider">Total Amount</td>
                                    <td className="py-4 px-6 text-right text-white">
                                        {order.total_amount} {order.currency || 'RON'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                        <h3 className="text-white font-bold uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Customer</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-zinc-500 text-xs uppercase tracking-wide">Email</p>
                                <p className="text-zinc-300 break-all">{order.customer_email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs uppercase tracking-wide">Phone</p>
                                <p className="text-zinc-300">{order.customer_phone || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                        <h3 className="text-white font-bold uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Shipping Address</h3>
                        <div className="text-sm text-zinc-300 leading-relaxed">
                            {order.shipping_address ? (
                                <>
                                    <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                    <p>{order.shipping_address.streetAddress}</p>
                                    <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                                    <p>{order.shipping_address.country}</p>
                                </>
                            ) : (
                                <p className="text-zinc-500 italic">No address provided</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
