const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
    try {
        // 1. Fetch a demo product for reference
        const { data: products, error: prodErr } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (prodErr) throw prodErr;

        let product;
        if (products && products.length > 0) {
            product = products[0];
        } else {
            console.log("No products found, using mock data for item");
            product = {
                id: null,
                name: "Mock Product",
                price: 100,
                images: ["https://placekitten.com/200/200"]
            };
        }

        const newOrderId = crypto.randomUUID();

        // 1.5 Fetch profile id for thepacenote.crew@gmail.com
        const { data: profiles, error: profileErr } = await supabase
            .from('profiles')
            .select('id, email');

        let targetProfileId = null;
        if (profiles) {
            const profile = profiles.find(p => p.email === 'thepacenote.crew@gmail.com');
            if (profile) targetProfileId = profile.id;
        }

        if (profileErr) console.error("Could not fetch profile", profileErr);

        console.log(`Using target user ID: ${targetProfileId}`);

        // 2. Insert mock order
        const orderData = {
            id: newOrderId,
            user_id: targetProfileId,
            status: "pending",
            total_amount: product.price * 2 + 15, // quantity 2 + shipping
            currency: "RON",
            customer_email: "thepacenote.crew@gmail.com",
            customer_phone: "+40 722 000 000",
            shipping_address: {
                firstName: "Vlad",
                lastName: "Neculai",
                addressLine1: "Strada Exemplu Nr 1",
                city: "Bucuresti",
                postalCode: "010001",
                country: "Romania"
            },
            payment_intent_id: "pi_mock_12345"
        };

        const { error: orderErr } = await supabase
            .from('orders')
            .insert(orderData);

        if (orderErr) throw orderErr;

        console.log("Created order:", newOrderId);

        // 3. Insert mock order items
        const itemData = {
            order_id: newOrderId,
            product_id: product.id,
            quantity: 2,
            price_at_purchase: product.price,
            product_name: product.name,
            product_image: product.images && product.images[0] ? product.images[0] : null
        };

        const { error: itemErr } = await supabase
            .from('order_items')
            .insert(itemData);

        if (itemErr) throw itemErr;

        console.log("Inserted order item!");
        console.log("Successfully created order example. You can check it out in your Admin Dashboard under 'Orders'.");

    } catch (err) {
        console.error("Error creating mock order:", err);
    }
})();
