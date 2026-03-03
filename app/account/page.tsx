"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types/profile";
import T from "@/components/T";

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
    order_items?: OrderItem[];
}

import PhoneInput from "react-phone-number-input";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function Account() {
    const { user, role, logout, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        phone_number: '',
        address_line1: '', // This will now be a combination or just the street name
        address_line2: '', // This will store floor/apt info
        street_name: '',
        street_number: '',
        floor: '',
        apartment: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_company: false,
        company_name: '',
        company_tax_id: '',
        use_shipping_address: false,
        shipping_address_line1: '',
        shipping_street_name: '',
        shipping_street_number: '',
        shipping_floor: '',
        shipping_apartment: '',
        shipping_address_line2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: ''
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                } else if (data) {
                    setProfile(data);
                    setFormData({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        username: data.username || '',
                        phone_number: data.phone_number || '',
                        // Parsing logic for address lines if they exist but detailed fields don't (legacy/first load)
                        // This is a best-effort parse. Ideally we rely on the user to fill them properly.
                        // For now we just put the whole address_line1 into name if we can't split it easily.
                        street_name: data.address_line1 || '', // We treat address_line1 as street name if no other info
                        street_number: '', // User must fill requirement
                        floor: '',
                        apartment: '',
                        address_line1: data.address_line1 || '',
                        address_line2: data.address_line2 || '',
                        city: data.city || '',
                        state: data.state || '',
                        postal_code: data.postal_code || '',
                        country: data.country || '',
                        is_company: data.is_company || false,
                        company_name: data.company_name || '',
                        company_tax_id: data.company_tax_id || '',
                        use_shipping_address: !!data.shipping_address_line1,
                        shipping_address_line1: data.shipping_address_line1 || '',
                        shipping_street_name: data.shipping_address_line1 || '',
                        shipping_street_number: '',
                        shipping_floor: '',
                        shipping_apartment: '',
                        shipping_address_line2: data.shipping_address_line2 || '',
                        shipping_city: data.shipping_city || '',
                        shipping_state: data.shipping_state || '',
                        shipping_postal_code: data.shipping_postal_code || '',
                        shipping_country: data.shipping_country || ''
                    });
                }
                setLoading(false);
            }
        };

        const fetchOrders = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data && !error) {
                    setOrders(data);
                }
                setLoadingOrders(false);
            }
        };

        if (user) {
            fetchProfile();
            fetchOrders();
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handlePhoneChange = (value?: string) => {
        setFormData({
            ...formData,
            phone_number: value || ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        if (!user) return;

        // Validation
        const requiredFields = ['first_name', 'last_name', 'phone_number', 'street_name', 'street_number', 'city', 'state', 'postal_code', 'country'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            setMessage({ type: 'error', text: `Câmpuri obligatorii lipsă: ${missingFields.join(', ')}` });
            window.scrollTo(0, 0);
            setSaving(false);
            return;
        }

        // Construct composite address fields
        const finalAddressLine1 = `${formData.street_name} ${formData.street_number}`.trim();
        const addressParts = [];
        if (formData.floor) addressParts.push(`Floor ${formData.floor}`);
        if (formData.apartment) addressParts.push(`Apt ${formData.apartment}`);
        if (formData.address_line2) addressParts.push(formData.address_line2); // Keep existing part if user added it manually to legacy field? 
        // Actually we might want to just hide address_line2 input and replace with floor/apt inputs? 
        // Let's assume address_line2 acts as "Additional Info" + generated floor/apt?
        // Or simpler: just overwrite address_line2 with floor/apt string.
        const finalAddressLine2 = addressParts.join(', ');

        const finalShippingAddressLine1 = formData.use_shipping_address
            ? `${formData.shipping_street_name} ${formData.shipping_street_number}`.trim()
            : null;

        const shippingAddressParts = [];
        if (formData.shipping_floor) shippingAddressParts.push(`Floor ${formData.shipping_floor}`);
        if (formData.shipping_apartment) shippingAddressParts.push(`Apt ${formData.shipping_apartment}`);
        const finalShippingAddressLine2 = shippingAddressParts.join(', ');

        const { error } = await supabase
            .from('profiles')
            .update({
                phone_number: formData.phone_number || null,
                address_line1: finalAddressLine1 || null,
                address_line2: finalAddressLine2 || null, // Storing combined extra info here
                city: formData.city || null,
                state: formData.state || null,
                postal_code: formData.postal_code || null,
                country: formData.country || null,
                first_name: formData.first_name || null,
                last_name: formData.last_name || null,
                username: formData.username || null,
                is_company: formData.is_company,
                company_name: formData.is_company ? formData.company_name : null,
                company_tax_id: formData.is_company ? formData.company_tax_id : null,
                shipping_address_line1: formData.use_shipping_address ? finalShippingAddressLine1 : null,
                shipping_address_line2: formData.use_shipping_address ? finalShippingAddressLine2 : null,
                shipping_city: formData.use_shipping_address ? formData.shipping_city : null,
                shipping_state: formData.use_shipping_address ? formData.shipping_state : null,
                shipping_postal_code: formData.use_shipping_address ? formData.shipping_postal_code : null,
                shipping_country: formData.use_shipping_address ? formData.shipping_country : null,
            })
            .eq('id', user.id);

        if (error) {
            setMessage({ type: 'error', text: `Eroare: ${error.message}` });
        } else {
            setMessage({ type: 'success', text: "Profilul a fost actualizat cu succes." });
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) setProfile(data);
            setIsEditing(false);
        }
        setSaving(false);
    };

    if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><T>Se încarcă...</T></div>;

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight uppercase">
                            <T>Cont</T>
                        </h2>
                        <p className="mt-1 text-zinc-400">
                            <T>Welcome back,</T> <span className="text-white font-semibold">{user?.email}</span>
                        </p>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="ml-3 inline-flex items-center rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 uppercase tracking-wide mr-4"
                            >
                                <T>Admin Dashboard</T>
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => logout()}
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 uppercase tracking-wide"
                        >
                            <T>Logout</T>
                        </button>
                    </div>
                </div>

                <div className="mt-10 border-t border-zinc-800 pt-10">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4"><T>Cont</T></h3>

                    {message && (
                        <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}


                    {!isEditing ? (
                        <>
                            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 max-w-4xl">
                                <div className="flex justify-end mb-6">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 uppercase tracking-wide"
                                    >
                                        <T>Modify Profile</T>
                                    </button>
                                </div>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-zinc-400"><T>Nume</T></dt>
                                        <dd className="mt-1 text-sm text-white">{profile?.first_name || '-'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-zinc-400"><T>Prenume</T></dt>
                                        <dd className="mt-1 text-sm text-white">{profile?.last_name || '-'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-zinc-400"><T>Nume utilizator</T></dt>
                                        <dd className="mt-1 text-sm text-white">{profile?.username || '-'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-zinc-400"><T>Email</T></dt>
                                        <dd className="mt-1 text-sm text-white">{user?.email || '-'}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-zinc-400"><T>Telefon</T></dt>
                                        <dd className="mt-1 text-sm text-white">{profile?.phone_number || '-'}</dd>
                                    </div>
                                    {profile?.is_company && (
                                        <>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-zinc-400"><T>Nume companie</T></dt>
                                                <dd className="mt-1 text-sm text-white">{profile?.company_name || '-'}</dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-zinc-400"><T>CUI/CIF</T></dt>
                                                <dd className="mt-1 text-sm text-white">{profile?.company_tax_id || '-'}</dd>
                                            </div>
                                        </>
                                    )}
                                    <div className="sm:col-span-2 border-t border-zinc-800 pt-4 mt-4">
                                        <h4 className="text-lg font-medium text-white mb-4"><T>Adresă de facturare</T></h4>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-zinc-400"><T>Adresă</T></dt>
                                        <dd className="mt-1 text-sm text-white">
                                            {profile?.address_line1}<br />
                                            {profile?.address_line2 && <>{profile.address_line2}<br /></>}
                                            {profile?.city}, {profile?.state} {profile?.postal_code}<br />
                                            {profile?.country}
                                        </dd>
                                    </div>
                                    {(profile?.shipping_address_line1) && (
                                        <>
                                            <div className="sm:col-span-2 border-t border-zinc-800 pt-4 mt-4">
                                                <h4 className="text-lg font-medium text-white mb-4"><T>Adresă de livrare</T></h4>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-zinc-400"><T>Adresă de livrare</T></dt>
                                                <dd className="mt-1 text-sm text-white">
                                                    {profile?.shipping_address_line1}<br />
                                                    {profile?.shipping_address_line2 && <>{profile.shipping_address_line2}<br /></>}
                                                    {profile?.shipping_city}, {profile?.shipping_state} {profile?.shipping_postal_code}<br />
                                                    {profile?.shipping_country}
                                                </dd>
                                            </div>
                                        </>
                                    )}
                                </dl>
                            </div>

                            {/* Order History Section */}
                            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 max-w-4xl mt-8">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-6"><T>Order History</T></h3>
                                {loadingOrders ? (
                                    <p className="text-zinc-400"><T>Loading orders...</T></p>
                                ) : orders.length === 0 ? (
                                    <p className="text-zinc-400 italic"><T>No orders found.</T></p>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <Link href={`/order/${order.id}`} key={order.id} className="block border border-zinc-800 rounded-lg p-4 bg-black/50 hover:bg-zinc-900/50 hover:border-zinc-600 transition-colors cursor-pointer">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 mb-4 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-400"><T>Order ID:</T> <span className="text-white font-mono">{order.id.slice(0, 8)}...</span></p>
                                                        <p className="text-xs text-zinc-500 mt-1">{new Date(order.created_at).toLocaleDateString()} <T>at</T> {new Date(order.created_at).toLocaleTimeString()}</p>
                                                    </div>
                                                    <div className="flex flex-col items-start md:items-end gap-2">
                                                        <p className="text-sm font-bold text-white"><T>Total:</T> {order.total_amount} {order.currency}</p>
                                                        <span className={`px-2 py-1 text-xs uppercase tracking-widest font-bold rounded ${order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                                                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                                                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                                                                    'bg-yellow-500/20 text-yellow-500'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {order.order_items?.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-4">
                                                            {item.product_image ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <div className="w-16 h-16 rounded overflow-hidden bg-zinc-900 flex-shrink-0">
                                                                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 rounded bg-zinc-900 border border-zinc-800 border-dashed flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-xs text-zinc-600"><T>No Img</T></span>
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-white uppercase tracking-wide">{item.product_name}</p>
                                                                <p className="text-sm text-zinc-400 font-medium">{item.quantity} x {item.price_at_purchase} {order.currency}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 max-w-4xl">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                {/* Personal Information */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-zinc-400"><T>Nume</T> <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="first_name" id="first_name" required value={formData.first_name} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-zinc-400"><T>Prenume</T> <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="last_name" id="last_name" required value={formData.last_name} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-400"><T>Nume utilizator</T></label>
                                    <div className="mt-2">
                                        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-400"><T>Email</T></label>
                                    <div className="mt-2">
                                        <input type="email" name="email" id="email" value={user?.email || ''} disabled className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-zinc-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3 cursor-not-allowed" />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-zinc-300">
                                        <T>Telefon</T> <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <PhoneInput
                                            international
                                            defaultCountry="RO"
                                            value={formData.phone_number}
                                            onChange={handlePhoneChange}
                                            className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:text-sm sm:leading-6 pl-3"
                                        />
                                    </div>
                                </div>



                                <div className="sm:col-span-full border-t border-zinc-800 pt-6 mt-2">
                                    <h4 className="text-lg font-medium text-white mb-4"><T>Adresă de facturare</T></h4>
                                </div>

                                {/* Company Info Header */}
                                <div className="sm:col-span-full mb-6">
                                    <div className="relative flex items-start">
                                        <div className="flex h-6 items-center">
                                            <input
                                                id="is_company"
                                                name="is_company"
                                                type="checkbox"
                                                checked={formData.is_company}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm leading-6">
                                            <label htmlFor="is_company" className="font-medium text-white"><T>Sunt persoană juridică</T></label>
                                            <p className="text-zinc-400"><T>Bifați dacă doriți facturarea pe firmă.</T></p>
                                        </div>
                                    </div>
                                </div>

                                {formData.is_company && (
                                    <>
                                        <div className="sm:col-span-3">
                                            <label htmlFor="company_name" className="block text-sm font-medium leading-6 text-zinc-400"><T>Nume companie</T></label>
                                            <div className="mt-2">
                                                <input type="text" name="company_name" id="company_name" value={formData.company_name} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="company_tax_id" className="block text-sm font-medium leading-6 text-zinc-400">CUI/CIF</label>
                                            <div className="mt-2">
                                                <input type="text" name="company_tax_id" id="company_tax_id" value={formData.company_tax_id} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="sm:col-span-full">
                                    <AddressAutocomplete
                                        label="Nume stradă"
                                        id="street_name"
                                        name="street_name"
                                        required
                                        defaultValue={formData.street_name}
                                        onInputChange={(value) => setFormData(prev => ({ ...prev, street_name: value }))}
                                        onSelect={(address) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                street_name: address.street || address.address_line1,
                                                street_number: address.house_number || prev.street_number,
                                                city: address.city,
                                                state: address.state,
                                                country: address.country
                                            }));
                                        }}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="street_number" className="block text-sm font-medium leading-6 text-zinc-400"><T>Număr</T> <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="street_number" id="street_number" required value={formData.street_number} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="floor" className="block text-sm font-medium leading-6 text-zinc-400"><T>Etaj</T></label>
                                    <div className="mt-2">
                                        <input type="text" name="floor" id="floor" value={formData.floor} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="apartment" className="block text-sm font-medium leading-6 text-zinc-400"><T>Apartament</T></label>
                                    <div className="mt-2">
                                        <input type="text" name="apartment" id="apartment" value={formData.apartment} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                {/* Replaced Address Line 2 with specific fields, but might keep it as generic "Additional Info"? 
                                    The user requested Floor/Apt specifically. Let's hide the generic field to avoid confusion or use it as such.
                                    For now, I'll remove the explicit Address Line 2 input and assume Floor/Apt covers the needs.
                                */}

                                <div className="sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-zinc-400"><T>Oraș / Localitate</T> <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <AddressAutocomplete
                                        label="Județ / Sector"
                                        id="state"
                                        name="state"
                                        required
                                        searchType="state"
                                        defaultValue={formData.state}
                                        onInputChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                                        onSelect={(address) => {
                                            // When selecting a state, we primarily want the state name.
                                            // But if it returns country, we can check that too.
                                            setFormData(prev => ({
                                                ...prev,
                                                state: address.state, // Or address.address_line1 as fallback if state is empty, handled by component logic somewhat
                                            }));
                                        }}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="postal_code" className="block text-sm font-medium leading-6 text-zinc-400"><T>Cod Poștal</T> <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="postal_code" id="postal_code" required value={formData.postal_code} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-zinc-400"><T>Țară</T> <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="country" id="country" required value={formData.country} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>


                                {/* Shipping Address Checkbox */}
                                <div className="sm:col-span-full border-t border-zinc-800 pt-6 mt-2">
                                    <div className="relative flex items-start">
                                        <div className="flex h-6 items-center">
                                            <input
                                                id="use_shipping_address"
                                                name="use_shipping_address"
                                                type="checkbox"
                                                checked={formData.use_shipping_address}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm leading-6">
                                            <label htmlFor="use_shipping_address" className="font-medium text-white"><T>Adresă de livrare diferită</T></label>
                                        </div>
                                    </div>
                                </div>

                                {formData.use_shipping_address && (
                                    <>
                                        <div className="sm:col-span-full">
                                            <h4 className="text-lg font-medium text-white mb-4 mt-4"><T>Adresă de livrare</T></h4>
                                        </div>
                                        <div className="sm:col-span-full">
                                            <AddressAutocomplete
                                                label="Nume stradă"
                                                id="shipping_street_name"
                                                name="shipping_street_name"
                                                defaultValue={formData.shipping_street_name}
                                                onInputChange={(value) => setFormData(prev => ({ ...prev, shipping_street_name: value }))}
                                                onSelect={(address) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        shipping_street_name: address.street || address.address_line1,
                                                        shipping_street_number: address.house_number || prev.shipping_street_number,
                                                        shipping_city: address.city,
                                                        shipping_state: address.state,
                                                        shipping_postal_code: address.postal_code,
                                                        shipping_country: address.country
                                                    }));
                                                }}
                                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"
                                            />
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label htmlFor="shipping_street_number" className="block text-sm font-medium leading-6 text-zinc-400"><T>Număr</T> <span className="text-red-500">*</span></label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_street_number" id="shipping_street_number" required={formData.use_shipping_address} value={formData.shipping_street_number} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label htmlFor="shipping_floor" className="block text-sm font-medium leading-6 text-zinc-400"><T>Etaj</T></label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_floor" id="shipping_floor" value={formData.shipping_floor} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label htmlFor="shipping_apartment" className="block text-sm font-medium leading-6 text-zinc-400"><T>Apartament</T></label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_apartment" id="shipping_apartment" value={formData.shipping_apartment} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 sm:col-start-1">
                                            <label htmlFor="shipping_city" className="block text-sm font-medium leading-6 text-zinc-400"><T>Oraș / Localitate</T></label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_city" id="shipping_city" value={formData.shipping_city} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <AddressAutocomplete
                                                label="Județ / Sector"
                                                id="shipping_state"
                                                name="shipping_state"
                                                searchType="state"
                                                defaultValue={formData.shipping_state}
                                                onInputChange={(value) => setFormData(prev => ({ ...prev, shipping_state: value }))}
                                                onSelect={(address) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        shipping_state: address.state,
                                                    }));
                                                }}
                                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="shipping_postal_code" className="block text-sm font-medium leading-6 text-zinc-400"><T>Cod Poștal</T></label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_postal_code" id="shipping_postal_code" value={formData.shipping_postal_code} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label htmlFor="shipping_country" className="block text-sm font-medium leading-6 text-zinc-400"><T>Țară</T></label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_country" id="shipping_country" value={formData.shipping_country} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                                >
                                    <T>Renunță</T>
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                                >
                                    {saving ? <T>Se salvează...</T> : <T>Salvează</T>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main >
            <Footer />
        </div >
    );
}
