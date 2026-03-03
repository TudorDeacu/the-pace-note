"use client";

import { useState, useMemo, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
}

// Helper to convert 2-letter ISO code to an Emoji flag
const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
    const countries = useMemo(() => {
        // use react-phone-number-input's built in country list and locale map (or Intl API)
        const codes = getCountries();

        return codes.map((code) => {
            // we use the english names provided by the lib's locale 
            const name = en[code as keyof typeof en] || code;
            return {
                code,
                name,
                flag: getFlagEmoji(code),
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    // The user's text state might just be "Romania". We need to find the matching object.
    const selectedObj = countries.find((c) => c.name === value) || countries.find((c) => c.code === "RO");

    const handleChange = (selectedOption: { code: string; name: string; flag: string }) => {
        onChange(selectedOption.name);
    };

    // Ensure we send back a string 'name' to not break the parent form data structure
    return (
        <Listbox value={selectedObj} onChange={handleChange}>
            {({ open }) => (
                <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-zinc-900 py-2.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6">
                        <span className="flex items-center gap-2 truncate">
                            <span>{selectedObj?.flag}</span>
                            <span>{selectedObj?.name}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                        </span>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {countries.map((country) => (
                                <Listbox.Option
                                    key={country.code}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? "bg-red-600 text-white" : "text-white"
                                        }`
                                    }
                                    value={country}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`flex items-center gap-2 truncate ${selected ? "font-semibold" : "font-normal"}`}>
                                                <span>{country.flag}</span>
                                                <span>{country.name}</span>
                                            </span>

                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? "text-white" : "text-red-500"
                                                        }`}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}
