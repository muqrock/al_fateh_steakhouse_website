import CustomerLayout from '@/layouts/CustomerLayout';
import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

type MenuItem = {
    name: string;
    price: number;
    image: string;
    description?: string;
    [key: string]: unknown;
};

type PageProps = {
    menu: {
        [category: string]: MenuItem[];
    };
};

type MenuItemProps = {
    imageUrl: string;
    name: string;
    price: number;
};

type MenuSectionProps = {
    title: string;
    children: React.ReactNode;
};

const MenuItem = ({ imageUrl, name, price, onClick }: MenuItemProps & { onClick?: () => void }) => (
    <div
        className="relative transform cursor-pointer rounded-lg border border-orange-200/40 bg-gradient-to-br from-orange-50/80 to-amber-50/80 p-4 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${name}`}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (onClick) {
                    onClick();
                }
            }
        }}
    >
        <img
            src={imageUrl}
            alt={name}
            className="mb-2 h-32 w-full rounded object-cover"
            onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
            }}
        />
        <div className="">
            <h3 className="text-lg font-semibold text-orange-900">{name}</h3>
            <p className="text-sm text-orange-700">RM {Number(price).toFixed(2)}</p>
        </div>
    </div>
);

const MenuSection = ({ title, children }: MenuSectionProps) => (
    <section className="mb-10 transition-all duration-300 ease-in-out">
        <h2 className="mb-4 border-b border-orange-400 pb-2 text-xl font-bold text-white drop-shadow-lg">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
);

export default function MenuPage() {
    const { menu = {} } = usePage<PageProps>().props;
    const [selectedMenu, setSelectedMenu] = useState<(MenuItem & { category?: string }) | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter menu items based on search and category
    const getFilteredMenu = () => {
        let filteredMenu = { ...menu };

        // Filter by category
        if (selectedCategory !== 'All') {
            filteredMenu = { [selectedCategory]: menu[selectedCategory] || [] };
        }

        // Filter by search term
        if (searchTerm) {
            const filtered: { [category: string]: MenuItem[] } = {};
            Object.entries(filteredMenu).forEach(([category, items]) => {
                const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
                if (filteredItems.length > 0) {
                    filtered[category] = filteredItems;
                }
            });
            return filtered;
        }

        return filteredMenu;
    };

    const categories = ['All', ...Object.keys(menu)];

    return (
        <CustomerLayout
            currentPage="menu"
            transparentNav={true}
            fullHeight={true}
            backgroundImage="https://scontent.fkul16-2.fna.fbcdn.net/v/t39.30808-6/475973444_1099047458586906_1471199143652275342_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=P9T2Kl0P6BgQ7kNvwHLwGbO&_nc_oc=Adl3ozV0dvI6avP54mmITaSgAHBiDhkbJqp6keeUNQUW_d_rq8Ps_yZT50ftFPvvOHQ&_nc_zt=23&_nc_ht=scontent.fkul16-2.fna&_nc_gid=PA-1Etd0iN12GKHJ6WggEQ&oh=00_AfTmQynrKwXbWYmW-eU-atfOjxH8R8w-he5tpzSpZ8LKYA&oe=6875205C"
            title="Menu"
        >
            <div className="flex min-h-screen flex-1 flex-col p-4">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    {/* Header with Title */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Our Menu</h1>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="mb-6 rounded-xl border border-orange-200/40 bg-gradient-to-br from-orange-50/70 to-amber-50/70 p-4 shadow-lg backdrop-blur-sm">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Search Input */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-orange-800">Search Menu</label>
                                <input
                                    type="text"
                                    placeholder="Search for dishes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded border border-orange-200 bg-white/90 p-3 text-orange-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                />
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-orange-800">Filter by Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full rounded border border-orange-200 bg-white/90 p-3 text-orange-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category} className="bg-white">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {Object.keys(getFilteredMenu()).length === 0 ? (
                        <div className="flex min-h-[400px] items-center justify-center py-12 text-center transition-all duration-300 ease-in-out">
                            <div className="rounded-xl border border-orange-200/40 bg-gradient-to-br from-orange-50/70 to-amber-50/70 p-8 shadow-lg backdrop-blur-sm">
                                <h3 className="mb-2 text-xl font-bold text-orange-900">No items found</h3>
                                <p className="text-orange-700">Try adjusting your search or filter options.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-[600px] transition-all duration-300 ease-in-out">
                            {Object.entries(getFilteredMenu()).map(([category, items]) => (
                                <MenuSection title={category} key={category}>
                                    {items.map((item, idx) => (
                                        <MenuItem
                                            key={idx}
                                            imageUrl={item.image}
                                            name={item.name}
                                            price={item.price}
                                            onClick={() => setSelectedMenu({ ...item, category })}
                                        />
                                    ))}
                                </MenuSection>
                            ))}
                        </div>
                    )}

                    {/* Popup Modal for Menu Details */}
                    {selectedMenu && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                            <div className="animate-fade-in relative w-full max-w-md rounded-xl border-2 border-orange-300/60 bg-gradient-to-br from-orange-50/95 to-amber-50/95 p-8 shadow-2xl backdrop-blur-sm">
                                <button
                                    className="absolute top-3 right-3 text-2xl font-bold text-orange-600 hover:text-orange-800 focus:outline-none"
                                    onClick={() => setSelectedMenu(null)}
                                    aria-label="Close menu details"
                                >
                                    &times;
                                </button>
                                <img
                                    src={selectedMenu.image}
                                    alt={selectedMenu.name}
                                    className="mb-4 h-56 w-full rounded-lg border border-orange-200 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/333?text=Image';
                                    }}
                                />
                                <h3 className="mb-2 text-2xl font-bold text-orange-900">{selectedMenu.name}</h3>
                                <p className="mb-2 text-lg text-orange-800">RM {Number(selectedMenu.price).toFixed(2)}</p>
                                {selectedMenu.category && (
                                    <p className="mb-2 text-sm font-semibold tracking-wider text-orange-600 uppercase">{selectedMenu.category}</p>
                                )}
                                {selectedMenu.description && <p className="mb-2 text-orange-700">{selectedMenu.description}</p>}
                                {/* Show all other info if available */}
                                {Object.entries(selectedMenu)
                                    .filter(
                                        ([key]) =>
                                            !['name', 'price', 'image', 'category', 'description', 'id', 'created_at', 'updated_at'].includes(key),
                                    )
                                    .map(([key, value]) => (
                                        <p key={key} className="text-sm text-orange-600">
                                            <span className="font-semibold text-orange-800 capitalize">{key}:</span> {String(value)}
                                        </p>
                                    ))}
                            </div>
                        </div>
                    )}

                    <Link
                        href="/order"
                        className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-bold tracking-wider text-white uppercase transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg focus:ring-4 focus:ring-orange-400 focus:outline-none"
                    >
                        Order Now!
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto bg-black/70 py-4 text-center text-sm text-white">
                &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
            </footer>
        </CustomerLayout>
    );
}
