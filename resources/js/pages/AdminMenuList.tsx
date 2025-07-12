import AdminLayout from '@/layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

const categories = [
    'FRIED CHICKEN',
    'BEEF GRILL',
    'CHICKEN GRILL',
    'LAMB GRILL',
    'NASI (PUTIH/BUTTER)',
    'SPECIAL SEAFOOD',
    'COMBO SPECIAL',
    'SPECIAL BEEF',
    'SIDE DISH',
    'SPAGHETTI',
    'ADD ON DEALS',
    'DRINKS',
    'GELAS BESAR/JUG',
];

interface MenuItem {
    id: number;
    name: string;
    category?: string | null;
    price: number;
    image: string | null;
}

interface PageProps {
    menus: MenuItem[];
    [key: string]: unknown;
}

const AdminMenuList: React.FC = () => {
    const { menus } = usePage<PageProps>().props;
    const [showModal, setShowModal] = useState(false);
    const [editMenu, setEditMenu] = useState<MenuItem | null>(null);

    const { data, setData, processing, reset, errors } = useForm({
        name: '',
        category: '',
        price: '',
        image: null as File | null,
    });

    const groupedMenus = menus.reduce((acc: Record<string, MenuItem[]>, item) => {
        const category = item.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});
    const sortedCategoryKeys = Object.keys(groupedMenus).sort((a, b) => a.localeCompare(b));

    const openAddModal = () => {
        setEditMenu(null);
        setData({ name: '', category: '', price: '', image: null });
        setShowModal(true);
    };

    const openEditModal = (menu: MenuItem) => {
        setEditMenu(menu);
        setData({
            name: menu.name,
            category: menu.category || '',
            price: menu.price.toString(),
            image: null,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMenu(null);
        reset();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('category', data.category);
            formData.append('price', data.price);
            if (data.image) formData.append('image', data.image);

            const url = editMenu ? `/admin/menu/${editMenu.id}` : '/admin/menu';
            const method = editMenu ? 'PUT' : 'POST';

            await router.post(
                url,
                {
                    _method: method,
                    ...Object.fromEntries(formData),
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        closeModal();
                        router.reload();
                    },
                    onError: (errors) => {
                        console.error('Form error:', errors);
                    },
                },
            );
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this menu item?')) {
            router.post(`/admin/menu/${id}`, { _method: 'DELETE' });
        }
    };

    return (
        <AdminLayout currentPage="Menu List">
            <div
                style={{
                    minHeight: '100vh',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1554998171-89445e31c52b?q=80&w=2940&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                }}
                className="relative"
            >
                <div className="m-0 min-h-screen w-full bg-white/80 p-0 dark:bg-gray-900/80">
                    <h2 className="mb-6 text-3xl font-bold text-orange-900 dark:text-yellow-400">Menu List</h2>
                    <button className="mb-4 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600" onClick={openAddModal}>
                        + Add Menu
                    </button>

                    <table className="w-full table-fixed border-separate border-spacing-0 border">
                        <thead>
                            <tr className="bg-gray-100 text-black dark:bg-gray-800 dark:text-white">
                                <th className="w-1/4 border-r border-gray-300 p-2 text-left dark:border-gray-700">Name</th>
                                <th className="w-1/4 border-r border-gray-300 p-2 text-left dark:border-gray-700">Category</th>
                                <th className="w-24 border-r border-gray-300 p-2 text-center dark:border-gray-700">Price</th>
                                <th className="w-24 border-r border-gray-300 p-2 text-center dark:border-gray-700">Image</th>
                                <th className="w-32 p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCategoryKeys.map((category) => (
                                <React.Fragment key={category}>
                                    <tr className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white">
                                        <td colSpan={5} className="p-3 font-bold uppercase">
                                            {category}
                                        </td>
                                    </tr>
                                    {groupedMenus[category].map((menu) => (
                                        <tr key={menu.id} className="border-t border-gray-300 dark:border-gray-700">
                                            <td className="truncate border-r border-gray-200 p-2 dark:border-gray-700">{menu.name}</td>
                                            <td className="truncate border-r border-gray-200 p-2 dark:border-gray-700">{menu.category || '-'}</td>
                                            <td className="border-r border-gray-200 p-2 text-center dark:border-gray-700">
                                                RM{Number(menu.price).toFixed(2)}
                                            </td>
                                            <td className="border-r border-gray-200 p-2 text-center dark:border-gray-700">
                                                {menu.image && (
                                                    <img src={menu.image} alt={menu.name} className="mx-auto h-16 w-16 rounded object-cover" />
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button className="mr-2 text-blue-600 hover:underline" onClick={() => openEditModal(menu)}>
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:underline" onClick={() => handleDelete(menu.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="relative w-full max-w-md rounded bg-white p-8 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-white">
                                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-300" onClick={closeModal}>
                                    ✕
                                </button>
                                <h3 className="mb-4 text-xl font-bold">{editMenu ? 'Edit Menu' : 'Add Menu'}</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block font-semibold">Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded border border-gray-300 bg-white p-2 text-black dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* CATEGORY DROPDOWN */}
                                    <div>
                                        <label className="mb-2 block font-semibold">Category</label>
                                        <select
                                            value={categories.includes(data.category) ? data.category : '__custom__'}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === '__custom__') {
                                                    setData('category', '');
                                                } else {
                                                    setData('category', value);
                                                }
                                            }}
                                            className="mb-2 w-full rounded border border-gray-300 bg-white p-2 text-black dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">-- Select a category --</option>
                                            {categories.map((cat, idx) => (
                                                <option key={idx} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                            <option value="__custom__">+ Add new category</option>
                                        </select>

                                        {!categories.includes(data.category) && data.category !== '' && (
                                            <input
                                                type="text"
                                                placeholder="Enter new category"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className="w-full rounded border border-orange-400 bg-white p-2 text-black dark:bg-gray-700 dark:text-white"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-semibold">Price</label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full rounded border border-gray-300 bg-white p-2 text-black dark:bg-gray-700 dark:text-white"
                                            required
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>

                                    {/* IMAGE UPLOAD */}
                                    <div>
                                        <label className="mb-2 block font-semibold">Image</label>
                                        <div
                                            className="relative flex h-40 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-400 transition hover:border-orange-500"
                                            onClick={() => document.getElementById('imageInput')?.click()}
                                        >
                                            {data.image ? (
                                                <img src={URL.createObjectURL(data.image)} alt="Preview" className="h-full rounded object-contain" />
                                            ) : editMenu?.image ? (
                                                <img src={editMenu.image} alt="Current" className="h-full rounded object-contain" />
                                            ) : (
                                                <span className="text-center text-sm text-gray-500 dark:text-gray-300">Click to select an image</span>
                                            )}
                                        </div>
                                        <input
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                            className="hidden"
                                        />
                                    </div>

                                    {errors && (
                                        <div className="text-sm text-red-600">
                                            {Object.values(errors).map((err, i) => (
                                                <div key={i}>{err}</div>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                                    >
                                        {editMenu ? 'Update Menu' : 'Add Menu'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMenuList;
