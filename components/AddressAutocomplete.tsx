"use client";

import { useState, useEffect, useRef } from 'react';

interface AddressData {
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address: {
        house_number?: string;
        road?: string;
        residential?: string;
        borough?: string;
        neighbourhood?: string;
        quarter?: string;
        hamlet?: string;
        suburb?: string;
        island?: string;
        village?: string;
        town?: string;
        city?: string;
        city_district?: string;
        country?: string;
        country_code?: string;
        state?: string;
        state_district?: string;
        postcode?: string;
        region?: string;
        county?: string;
        municipality?: string;
        district?: string;
    };
}

interface AddressAutocompleteProps {
    onSelect: (address: AddressData) => void;
    defaultValue?: string;
    label?: string;
    required?: boolean;
    name?: string;
    id?: string;
    className?: string; // Allow passing className to match existing styles
    placeholder?: string;
}

export default function AddressAutocomplete({
    onSelect,
    defaultValue = '',
    label = 'Address Search',
    required = false,
    name,
    id,
    className,
    placeholder
}: AddressAutocompleteProps) {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Update query when defaultValue changes (e.g. from parent state)
    useEffect(() => {
        setQuery(defaultValue);
    }, [defaultValue]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSearch = async (searchTerm: string) => {
        if (searchTerm.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // Using OpenStreetMap Nominatim API
            // format=jsonv2 provides extra details
            // addressdetails=1 gives us the breakdown (road, city, etc.)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=jsonv2&addressdetails=1&limit=5`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9' // Prefer English results
                    }
                }
            );
            const data = await response.json();
            setSuggestions(data);
            setIsOpen(true);
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query && query !== defaultValue) { // Only search if query changed by user typing
                handleSearch(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, defaultValue]);

    const handleSelect = (item: NominatimResult) => {
        const addr = item.address;

        // Construct standard address fields
        // Nominatim returns various fields for city/state depending on location
        const city = addr.city || addr.town || addr.village || addr.municipality || '';
        const state = addr.state || addr.region || addr.county || '';
        const road = addr.road || '';
        const houseNumber = addr.house_number || '';
        const addressLine1 = [houseNumber, road].filter(Boolean).join(' ').trim() || item.display_name.split(',')[0];

        const selectedAddress: AddressData = {
            address_line1: addressLine1,
            city: city,
            state: state,
            postal_code: addr.postcode || '',
            country: addr.country || ''
        };

        setQuery(addressLine1); // Show the street address in the input
        setSuggestions([]);
        setIsOpen(false);
        onSelect(selectedAddress);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-zinc-400">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2 relative">
                <input
                    type="text"
                    name={name}
                    id={id}
                    required={required}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        // Also call onSelect with partial data if needed, 
                        // but usually we wait for selection.
                        // For now just update local state, act as normal input if they don't select.
                    }}
                    placeholder={placeholder}
                    className={className || "block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 pl-3"}
                    autoComplete="off" // Disable browser autocomplete to show ours
                />

                {loading && (
                    <div className="absolute right-3 top-2 text-zinc-500 text-xs">
                        Loading...
                    </div>
                )}

                {isOpen && suggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-white hover:bg-zinc-700"
                                onClick={() => handleSelect(item)}
                            >
                                <span className="block truncate">
                                    {item.display_name}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Attribution required by ODbL if heavily used, but for simple input usually OK. 
                Ideally shouldn't hide it completely if using public API. */}
        </div>
    );
}
