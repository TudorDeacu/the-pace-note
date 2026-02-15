"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types/profile";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function Account() {
    const { t } = useLanguage();
    const { user, role, logout, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        phone_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_company: false,
        company_name: '',
        company_tax_id: '',
        use_shipping_address: false,
        shipping_address_line1: '',
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

        if (user) {
            fetchProfile();
        }
    }, [user, supabase]);

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
        const requiredFields = ['first_name', 'last_name', 'phone_number', 'address_line1', 'city', 'state', 'postal_code', 'country'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            setMessage({ type: 'error', text: 'Please fill in all required fields.' });
            window.scrollTo(0, 0);
            setSaving(false);
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                phone_number: formData.phone_number || null,
                address_line1: formData.address_line1 || null,
                address_line2: formData.address_line2 || null,
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
                shipping_address_line1: formData.use_shipping_address ? formData.shipping_address_line1 : null,
                shipping_address_line2: formData.use_shipping_address ? formData.shipping_address_line2 : null,
                shipping_city: formData.use_shipping_address ? formData.shipping_city : null,
                shipping_state: formData.use_shipping_address ? formData.shipping_state : null,
                shipping_postal_code: formData.use_shipping_address ? formData.shipping_postal_code : null,
                shipping_country: formData.use_shipping_address ? formData.shipping_country : null,
            })
            .eq('id', user.id);

        if (error) {
            setMessage({ type: 'error', text: 'Error updating profile: ' + error.message });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) setProfile(data);
            setIsEditing(false);
        }
        setSaving(false);
    };

    if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight uppercase">
                            {t.account_page.title}
                        </h2>
                        <p className="mt-1 text-zinc-400">
                            Welcome back, <span className="text-white font-semibold">{user?.email}</span>
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">Role: <span className="uppercase">{role || 'User'}</span></p>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="ml-3 inline-flex items-center rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 uppercase tracking-wide mr-4"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => logout()}
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 uppercase tracking-wide"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-10 border-t border-zinc-800 pt-10">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4">Account Details</h3>

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
                                    Modify Profile
                                </button>
                            </div>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-zinc-400">First name</dt>
                                    <dd className="mt-1 text-sm text-white">{profile?.first_name || '-'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-zinc-400">Last name</dt>
                                    <dd className="mt-1 text-sm text-white">{profile?.last_name || '-'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-zinc-400">Username</dt>
                                    <dd className="mt-1 text-sm text-white">{profile?.username || '-'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-zinc-400">Email</dt>
                                    <dd className="mt-1 text-sm text-white">{user?.email || '-'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-zinc-400">Phone number</dt>
                                    <dd className="mt-1 text-sm text-white">{profile?.phone_number || '-'}</dd>
                                </div>
                                {profile?.is_company && (
                                    <>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-zinc-400">Company Name</dt>
                                            <dd className="mt-1 text-sm text-white">{profile?.company_name || '-'}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-zinc-400">Tax ID</dt>
                                            <dd className="mt-1 text-sm text-white">{profile?.company_tax_id || '-'}</dd>
                                        </div>
                                    </>
                                )}
                                <div className="sm:col-span-2 border-t border-zinc-800 pt-4 mt-4">
                                    <h4 className="text-lg font-medium text-white mb-4">Address</h4>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-zinc-400">Address</dt>
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
                                            <h4 className="text-lg font-medium text-white mb-4">Shipping Address</h4>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-zinc-400">Address</dt>
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
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 max-w-4xl">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                {/* Personal Information */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-zinc-400">First name <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="first_name" id="first_name" required value={formData.first_name} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-zinc-400">Last name <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="last_name" id="last_name" required value={formData.last_name} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-400">Username</label>
                                    <div className="mt-2">
                                        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-400">Email address</label>
                                    <div className="mt-2">
                                        <input type="email" name="email" id="email" value={user?.email || ''} disabled className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-zinc-500 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3 cursor-not-allowed" />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-zinc-300">
                                        Phone number <span className="text-red-500">*</span>
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
                                            <label htmlFor="is_company" className="font-medium text-white">Company Information</label>
                                            <p className="text-zinc-400">Check this box if you are purchasing on behalf of a company.</p>
                                        </div>
                                    </div>
                                </div>

                                {formData.is_company && (
                                    <>
                                        <div className="sm:col-span-3">
                                            <label htmlFor="company_name" className="block text-sm font-medium leading-6 text-zinc-400">Company Name</label>
                                            <div className="mt-2">
                                                <input type="text" name="company_name" id="company_name" value={formData.company_name} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="company_tax_id" className="block text-sm font-medium leading-6 text-zinc-400">Company Tax ID</label>
                                            <div className="mt-2">
                                                <input type="text" name="company_tax_id" id="company_tax_id" value={formData.company_tax_id} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-full border-t border-zinc-800 my-4"></div>
                                    </>
                                )}

                                <div className="sm:col-span-full border-t border-zinc-800 pt-6 mt-2">
                                    <h4 className="text-lg font-medium text-white mb-4">Contact & Delivery Info</h4>
                                </div>

                                <div className="sm:col-span-full">
                                    <AddressAutocomplete
                                        label="Address Line 1"
                                        id="address_line1"
                                        name="address_line1"
                                        required
                                        defaultValue={formData.address_line1}
                                        onSelect={(address) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                address_line1: address.address_line1,
                                                city: address.city,
                                                state: address.state,
                                                postal_code: address.postal_code,
                                                country: address.country
                                            }));
                                        }}
                                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"
                                    />
                                </div>

                                <div className="sm:col-span-full">
                                    <label htmlFor="address_line2" className="block text-sm font-medium leading-6 text-zinc-400">Address Line 2</label>
                                    <div className="mt-2">
                                        <input type="text" name="address_line2" id="address_line2" value={formData.address_line2} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-zinc-400">City <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="city" id="city" required value={formData.city} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="state" className="block text-sm font-medium leading-6 text-zinc-400">State / Province <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="state" id="state" required value={formData.state} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="postal_code" className="block text-sm font-medium leading-6 text-zinc-400">ZIP / Postal Code <span className="text-red-500">*</span></label>
                                    <div className="mt-2">
                                        <input type="text" name="postal_code" id="postal_code" required value={formData.postal_code} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-zinc-400">Country <span className="text-red-500">*</span></label>
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
                                            <label htmlFor="use_shipping_address" className="font-medium text-white">Different Shipping Address</label>
                                            <p className="text-zinc-400">Check this box to ship to a different address.</p>
                                        </div>
                                    </div>
                                </div>

                                {formData.use_shipping_address && (
                                    <>
                                        <div className="sm:col-span-full">
                                            <h4 className="text-lg font-medium text-white mb-4 mt-4">Shipping Address</h4>
                                        </div>
                                        <div className="sm:col-span-full">
                                            <AddressAutocomplete
                                                label="Address Line 1"
                                                id="shipping_address_line1"
                                                name="shipping_address_line1"
                                                defaultValue={formData.shipping_address_line1}
                                                onSelect={(address) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        shipping_address_line1: address.address_line1,
                                                        shipping_city: address.city,
                                                        shipping_state: address.state,
                                                        shipping_postal_code: address.postal_code,
                                                        shipping_country: address.country
                                                    }));
                                                }}
                                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"
                                            />
                                        </div>

                                        <div className="sm:col-span-full">
                                            <label htmlFor="shipping_address_line2" className="block text-sm font-medium leading-6 text-zinc-400">Address Line 2</label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_address_line2" id="shipping_address_line2" value={formData.shipping_address_line2} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 sm:col-start-1">
                                            <label htmlFor="shipping_city" className="block text-sm font-medium leading-6 text-zinc-400">City</label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_city" id="shipping_city" value={formData.shipping_city} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="shipping_state" className="block text-sm font-medium leading-6 text-zinc-400">State / Province</label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_state" id="shipping_state" value={formData.shipping_state} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="shipping_postal_code" className="block text-sm font-medium leading-6 text-zinc-400">ZIP / Postal Code</label>
                                            <div className="mt-2">
                                                <input type="text" name="shipping_postal_code" id="shipping_postal_code" value={formData.shipping_postal_code} onChange={handleChange} className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3" />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label htmlFor="shipping_country" className="block text-sm font-medium leading-6 text-zinc-400">Country</label>
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
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
