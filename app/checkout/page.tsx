"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import CountrySelect from "@/components/CountrySelect";
import T from "@/components/T";
import { useTranslationContext } from "@/context/TranslationContext";

// Dynamic import for Leaflet map to avoid SSR issues
const Map = dynamic(
    () => import("@/components/CheckoutMap"), // We'll create this component separately
    { ssr: false }
);

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function Checkout() {
    const { items, cartTotal } = useCart();
    const { user } = useAuth();
    const supabase = createClient();
    const { t } = useTranslationContext();

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        company: "",
        address: "",
        apartment: "",
        city: "",
        country: "Romania",
        postalCode: "",
        phone: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || prev.email,
                        firstName: data.first_name || prev.firstName,
                        lastName: data.last_name || prev.lastName,
                        company: data.company_name || prev.company,
                        address: data.address_line1 || prev.address,
                        city: data.city || prev.city,
                        country: data.country || prev.country,
                        postalCode: data.postal_code || prev.postalCode,
                        phone: data.phone_number || prev.phone
                    }));
                }
            }
        };

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormData((prev) => ({ ...prev, phone: value || "" }));
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold uppercase tracking-tighter mb-10"><T>Finalizare comandă</T></h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Form & Map */}
                    <div className="lg:col-span-7">
                        <form className="space-y-12">
                            {/* Contact Info */}
                            <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-8 shadow-sm">
                                <h2 className="text-lg font-bold leading-7 text-white uppercase tracking-widest pb-4 border-b border-zinc-800"><T>Informații de contact</T></h2>
                                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Adresă email</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-4">
                                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Număr telefon</T>
                                        </label>
                                        <div className="mt-2">
                                            <PhoneInput
                                                international
                                                defaultCountry="RO"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:text-sm sm:leading-6 pl-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-8 shadow-sm mt-8">
                                <h2 className="text-lg font-bold leading-7 text-white uppercase tracking-widest pb-4 border-b border-zinc-800"><T>Informații Livrare</T></h2>
                                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Prenume</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                autoComplete="given-name"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Nume</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                autoComplete="family-name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-4">
                                        <label htmlFor="company" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Companie (opțional)</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="company"
                                                id="company"
                                                autoComplete="organization"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Țară</T>
                                        </label>
                                        <CountrySelect
                                            value={formData.country}
                                            onChange={(val) => setFormData((prev) => ({ ...prev, country: val }))}
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="address" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Adresă (Stradă, Număr, Etaj, Apartament)</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                autoComplete="street-address"
                                                placeholder={t("Stradă, Număr, Etaj, Apartament")}
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 sm:col-start-1">
                                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Oraș</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="city"
                                                id="city"
                                                autoComplete="address-level2"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-zinc-300">
                                            <T>Cod Poștal</T>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="postalCode"
                                                id="postalCode"
                                                autoComplete="postal-code"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-0 bg-zinc-900 py-2.5 pl-3 text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-8 shadow-sm mt-8">
                                <h2 className="text-lg font-bold leading-7 text-white uppercase tracking-widest mb-2"><T>Locație Livrare</T></h2>
                                <p className="text-zinc-500 mb-6 text-sm"><T>Verifică adresa introdusă pe harta de mai jos.</T></p>
                                <div className="h-96 w-full rounded-lg overflow-hidden border border-zinc-800 shadow-inner bg-black">
                                    <Map address={formData.address} city={formData.city} country={formData.country} />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 bg-zinc-900/50 rounded-lg p-6 lg:p-8 mt-10 lg:mt-0 border border-zinc-800 sticky top-32">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-6"><T>Sumar Comandă</T></h2>
                        <ul role="list" className="divide-y divide-zinc-700">
                            {items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-700 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.image || "/images/logo.png"}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                            onError={(e) => {
                                                e.currentTarget.src = "/images/logo.png";
                                                e.currentTarget.onerror = null; // Prevent infinite loop
                                            }}
                                        />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-white">
                                                <h3 className="text-sm">{item.name}</h3>
                                                <p className="ml-4 text-sm">{item.price * item.quantity} RON</p>
                                            </div>
                                            {item.size && (
                                                <p className="mt-1 text-xs text-zinc-400"><T>Mărime</T>: {item.size}</p>
                                            )}
                                            <p className="mt-1 text-xs text-zinc-400"><T>Cantitate</T>: {item.quantity}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-zinc-700 pt-6 mt-6">
                            <div className="flex justify-between text-base font-medium text-white">
                                <p><T>Subtotal</T></p>
                                <p>{cartTotal} RON</p>
                            </div>
                            <div className="flex justify-between text-base font-medium text-zinc-400 mt-2">
                                <p><T>Livrare</T></p>
                                <p><T>Se calculează...</T></p>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white mt-6 border-t border-zinc-700 pt-6">
                                <p><T>Total</T></p>
                                <p>{cartTotal} RON</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-500 uppercase tracking-widest disabled:opacity-50"
                        >
                            <T>Confirmă Comanda</T>
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
