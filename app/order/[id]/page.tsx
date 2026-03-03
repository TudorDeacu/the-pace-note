"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircleIcon, ClockIcon, TruckIcon } from "@heroicons/react/24/outline";
import T from "@/components/T";
import { useTranslationContext } from "@/context/TranslationContext";

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
    product_image: string | null;
}

interface Order {
    id: string;
    status: string;
    total_amount: number;
    currency: string;
    created_at: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: any;
    order_items?: OrderItem[];
}

export default function OrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const { user, loading: authLoading } = useAuth();
    const supabase = createClient();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslationContext();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login"); // Require login to view orders
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user || !orderId) return;

            const { data, error } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .eq("id", orderId)
                .eq("user_id", user.id)
                .single();

            if (error || !data) {
                console.error("Error fetching order:", error);
                setError("Comanda nu a fost gasită sau nu ai permisiunea de a o vizualiza.");
            } else {
                setOrder(data);
            }
            setLoading(false);
        };

        if (user && !authLoading) {
            fetchOrder();
        }
    }, [user, orderId, authLoading, supabase]);

    if (authLoading || loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center"><T>Se încarcă...</T></div>;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-bold uppercase tracking-widest"><T>{error || "Comandă Negăsită"}</T></p>
                <Link href="/account" className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700"><T>Înapoi la Cont</T></Link>
            </div>
        );
    }

    // Determine active steps for the timeline
    const steps = [
        { id: 'pending', name: 'Comandă Plasată', icon: ClockIcon },
        { id: 'processing', name: 'Se procesează', icon: ClockIcon },
        { id: 'shipped', name: 'Expediată', icon: TruckIcon },
        { id: 'delivered', name: 'Livrată', icon: CheckCircleIcon },
    ];

    let currentStepIndex = steps.findIndex(s => s.id === order.status);
    // If status is cancelled, we might handle it differently but let's default to placing it at -1 or similar
    if (order.status === 'cancelled') currentStepIndex = -1;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/account" className="text-zinc-500 hover:text-white transition-colors">
                        ← <T>Înapoi la Cont</T>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest"><T>Detalii Comandă</T></h1>
                </div>

                {/* Status Timeline */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 mb-6">
                        <div>
                            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest"><T>Referință Comandă</T></p>
                            <p className="text-xl font-mono text-white mt-1">{order.id}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest"><T>Dată Plasare</T></p>
                            <p className="text-white mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {order.status === 'cancelled' ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center justify-center">
                            <p className="font-bold uppercase tracking-widest"><T>Această comandă a fost anulată.</T></p>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="overflow-hidden">
                                <ul role="list" className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                                    {steps.map((step, stepIdx) => {
                                        const isCompleted = stepIdx <= currentStepIndex;
                                        const isCurrent = stepIdx === currentStepIndex;
                                        const Icon = step.icon;

                                        return (
                                            <li key={step.name} className="relative flex-1">
                                                {/* Line connecting nodes */}
                                                {stepIdx !== steps.length - 1 && (
                                                    <div className={`hidden md:block absolute top-4 left-1/2 w-full h-0.5 -z-10 ${isCompleted ? 'bg-red-600' : 'bg-zinc-800'}`} />
                                                )}

                                                <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-red-600 border-red-600 text-white' :
                                                        'bg-zinc-900 border-zinc-700 text-zinc-500'
                                                        }`}>
                                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                                    </div>
                                                    <div className="flex flex-col md:items-center">
                                                        <p className={`text-sm font-bold uppercase tracking-widest ${isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                                                            <T>{step.name}</T>
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Delivery Info */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-4"><T>Detalii Livrare</T></h2>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-zinc-500 uppercase tracking-widest text-xs"><T>Contact</T></dt>
                                <dd className="mt-1 text-white">{order.customer_email}</dd>
                                <dd className="text-white mt-0.5">{order.customer_phone}</dd>
                            </div>
                            {order.shipping_address && (
                                <div>
                                    <dt className="text-zinc-500 uppercase tracking-widest text-xs"><T>Adresă Livrare</T></dt>
                                    <dd className="mt-1 text-white">
                                        <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                        <p>{order.shipping_address.addressLine1}</p>
                                        {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                                        <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                                        <p>{order.shipping_address.country}</p>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Order Summary Basics */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-4"><T>Sumar Plată</T></h2>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-400"><T>Subtotal</T></span>
                                <span className="text-white">{(order.total_amount - 15).toFixed(2)} {order.currency}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4 border-b border-zinc-800 pb-4">
                                <span className="text-zinc-400"><T>Estimare Livrare</T></span>
                                <span className="text-white">15.00 {order.currency}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold tracking-widest uppercase">
                            <span className="text-white"><T>Total</T></span>
                            <span className="text-red-500">{order.total_amount.toFixed(2)} {order.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-4 mb-4"><T>Produse în Comandă</T></h2>
                    <ul role="list" className="divide-y divide-zinc-800">
                        {order.order_items?.map((item) => (
                            <li key={item.id} className="py-6 flex">
                                {item.product_image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-dashed border-zinc-800 bg-zinc-900 flex items-center justify-center">
                                        <span className="text-xs text-zinc-600"><T>Fără img</T></span>
                                    </div>
                                )}

                                <div className="ml-4 flex flex-1 flex-col justify-center">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-white">
                                            <h3 className="uppercase tracking-widest font-bold">
                                                {item.product_name}
                                            </h3>
                                            <p className="ml-4 text-red-500">{item.price_at_purchase} {order.currency}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                        <p className="text-zinc-500 uppercase tracking-widest"><T>Cantitate</T> {item.quantity}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

            <Footer />
        </div>
    );
}
