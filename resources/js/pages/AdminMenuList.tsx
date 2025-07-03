import React, { useState } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Menu List', path: '/admin/menu', icon: '🍽️' },
  { name: 'Customer List', path: '/admin/customers', icon: '👥' },
  { name: 'Review List', path: '/admin/reviews', icon: '📝' },
];

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
  const [active, setActive] = useState('Menu List');

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

      await router.post(url, {
        _method: method,
        ...Object.fromEntries(formData),
      }, {
        forceFormData: true,
        onSuccess: () => {
          closeModal();
          router.reload();
        },
        onError: (errors) => {
          console.error('Form error:', errors);
        }
      });
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
    <div className="flex min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#4e2e1e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1 }}>
          {sidebarLinks.map(link => (
            <Link
              key={link.name}
              href={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 32px',
                color: link.name === 'Menu List' ? '#f8c471' : '#fff',
                background: link.name === 'Menu List' ? '#3b2012' : 'transparent',
                fontWeight: link.name === 'Menu List' ? 600 : 400,
                borderLeft: link.name === 'Menu List' ? '4px solid #f8c471' : '4px solid transparent',
              }}
              onClick={() => setActive(link.name)}
            >
              <span style={{ marginRight: 16, fontSize: 20 }}>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>
        <form
          onSubmit={e => {
            e.preventDefault();
            fetch('/admin/logout', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
              }
            }).then(() => window.location.href = '/');
          }}
        >
          <button type="submit" className="mx-auto mb-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
            Log out
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-900 dark:text-yellow-400">Menu List</h2>
        <button
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-bold"
          onClick={openAddModal}
        >
          + Add Menu
        </button>

        <table className="w-full border border-separate border-spacing-0 table-fixed">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
              <th className="p-2 border-r border-gray-300 dark:border-gray-700 w-1/4 text-left">Name</th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-700 w-1/4 text-left">Category</th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-700 w-24 text-center">Price</th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-700 w-24 text-center">Image</th>
              <th className="p-2 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategoryKeys.map((category) => (
              <React.Fragment key={category}>
                <tr className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                  <td colSpan={5} className="font-bold p-3 uppercase">{category}</td>
                </tr>
                {groupedMenus[category].map(menu => (
                  <tr key={menu.id} className="border-t border-gray-300 dark:border-gray-700">
                    <td className="p-2 border-r border-gray-200 dark:border-gray-700 truncate">{menu.name}</td>
                    <td className="p-2 border-r border-gray-200 dark:border-gray-700 truncate">{menu.category || '-'}</td>
                    <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-center">RM{Number(menu.price).toFixed(2)}</td>
                    <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-center">
                      {menu.image && (
                        <img src={menu.image} alt={menu.name} className="h-16 w-16 object-cover rounded mx-auto" />
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button className="mr-2 text-blue-600 hover:underline" onClick={() => openEditModal(menu)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDelete(menu.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded shadow-lg w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-300" onClick={closeModal}>✕</button>
              <h3 className="text-xl font-bold mb-4">{editMenu ? 'Edit Menu' : 'Add Menu'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                  />
                </div>

                {/* CATEGORY DROPDOWN */}
                <div>
                  <label className="block font-semibold mb-2">Category</label>
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
                    className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-black dark:text-white mb-2"
                  >
                    <option value="">-- Select a category --</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                    <option value="__custom__">+ Add new category</option>
                  </select>

                  {(!categories.includes(data.category) && data.category !== '') && (
                    <input
                      type="text"
                      placeholder="Enter new category"
                      value={data.category}
                      onChange={(e) => setData('category', e.target.value)}
                      className="w-full p-2 border border-orange-400 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold">Price</label>
                  <input
                    type="number"
                    value={data.price}
                    onChange={e => setData('price', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                    min={0}
                    step="0.01"
                  />
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block font-semibold mb-2">Image</label>
                  <div className="relative w-full h-40 border-2 border-dashed border-gray-400 rounded flex justify-center items-center cursor-pointer hover:border-orange-500 transition"
                       onClick={() => document.getElementById('imageInput')?.click()}>
                    {data.image ? (
                      <img src={URL.createObjectURL(data.image)} alt="Preview" className="h-full object-contain rounded" />
                    ) : editMenu?.image ? (
                      <img src={editMenu.image} alt="Current" className="h-full object-contain rounded" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 text-sm text-center">Click to select an image</span>
                    )}
                  </div>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                  />
                </div>

                {errors && (
                  <div className="text-red-600 text-sm">
                    {Object.values(errors).map((err, i) => (
                      <div key={i}>{err}</div>
                    ))}
                  </div>
                )}
                <button type="submit" disabled={processing}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-bold w-full">
                  {editMenu ? 'Update Menu' : 'Add Menu'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMenuList;
