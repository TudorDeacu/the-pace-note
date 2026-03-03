"use client";

interface CheckoutMapProps {
    address: string;
    city: string;
    country: string;
}

export default function CheckoutMap({ address, city, country }: CheckoutMapProps) {
    // Construct search query
    const addressParts = [address, city, country].filter(part => part && part.trim() !== "");
    let query = addressParts.join(", ");

    // Default to Bucharest, Romania if nothing is entered
    if (!query) {
        query = "Bucharest, Romania";
    }

    // Generate valid embed URL
    const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=near&output=embed`;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={googleMapUrl}
                title="Delivery Location Map"
                className="rounded-lg shadow-inner grayscale hover:grayscale-0 transition-all duration-700"
            />
        </div>
    );
}
