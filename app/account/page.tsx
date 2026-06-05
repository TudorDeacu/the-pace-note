import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "@/components/AccountForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function AccountPage() {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If there is no authenticated server session, boot the user to login instantly
    if (!user || authError) {
        redirect("/login");
    }

    // Await the profile data without tying up the browser's thread
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <AccountForm initialProfile={profile} user={user} />
            </main>
            <Footer />
        </div>
    );
}
