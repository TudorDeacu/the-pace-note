export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter mb-8 text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-zinc-400 uppercase tracking-widest">Total Articles</h3>
                    <p className="text-4xl font-bold text-white mt-2">0</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-zinc-400 uppercase tracking-widest">Total Products</h3>
                    <p className="text-4xl font-bold text-white mt-2">0</p>
                </div>
            </div>
        </div>
    );
}
