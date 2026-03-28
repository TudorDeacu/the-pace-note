"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import T from "@/components/T";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import AddressAutocomplete from "@/components/AddressAutocomplete";

import { useAuth } from "@/context/AuthContext";

// We extract the relevant props so the parent Server Component can feed data instantly
export default function AccountForm({ initialProfile, user }: { initialProfile: any; user: any }) {
    const { logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(initialProfile);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        username: profile?.username || '',
        phone_number: profile?.phone_number || '',
        street_name: profile?.address_line1 || '', // Legacy
        street_number: '',
        floor: '',
        apartment: '',
        address_line1: profile?.address_line1 || '',
        address_line2: profile?.address_line2 || '',
        city: profile?.city || '',
        state: profile?.state || '',
        postal_code: profile?.postal_code || '',
        country: profile?.country || '',
        is_company: profile?.is_company || false,
        company_name: profile?.company_name || '',
        company_tax_id: profile?.company_tax_id || '',
        use_shipping_address: !!profile?.shipping_address_line1,
        shipping_address_line1: profile?.shipping_address_line1 || '',
        shipping_street_name: profile?.shipping_address_line1 || '',
        shipping_street_number: '',
        shipping_floor: '',
        shipping_apartment: '',
        shipping_address_line2: profile?.shipping_address_line2 || '',
        shipping_city: profile?.shipping_city || '',
        shipping_state: profile?.shipping_state || '',
        shipping_postal_code: profile?.shipping_postal_code || '',
        shipping_country: profile?.shipping_country || ''
    });

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
        const requiredFields = ['first_name', 'last_name', 'phone_number'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            setMessage({ type: 'error', text: `Câmpuri obligatorii lipsă: ${missingFields.join(', ')}` });
            window.scrollTo(0, 0);
            setSaving(false);
            return;
        }

        const finalAddressLine1 = `${formData.street_name} ${formData.street_number}`.trim();
        const addressParts = [];
        if (formData.floor) addressParts.push(`Floor ${formData.floor}`);
        if (formData.apartment) addressParts.push(`Apt ${formData.apartment}`);
        if (formData.address_line2) addressParts.push(formData.address_line2); 
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
                address_line2: finalAddressLine2 || null,
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
            router.refresh(); // Trigger server component reload!
        }
        setSaving(false);
    };

    return (
        <>
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
                    {profile?.role === 'admin' && (
                        <Link
                            href="/admin"
                            className="ml-3 inline-flex items-center rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 uppercase tracking-wide mr-4"
                        >
                            <T>Admin Dashboard</T>
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={logout}
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
                        </dl>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 max-w-4xl">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
        </>
    );
}
