import React, { useState } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Menu List', path: '/admin/menu', icon: '🍽️' },
  { name: 'Customer List', path: '/admin/customers', icon: '👥' },
  { name: 'Review List', path: '/admin/reviews', icon: '📝' },
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
}

const AdminMenuList: React.FC = () => {
  const { menus } = usePage<PageProps>().props;
  const [showModal, setShowModal] = useState(false);
  const [editMenu, setEditMenu] = useState<MenuItem | null>(null);
  const [active, setActive] = useState('Menu List');

  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    category: '',
    price: '',
    image: null as File | null,
  });

  const openAddModal = () => {
    setEditMenu(null);
    setData({ name: '', category: '', price: '', image: null });
    setShowModal(true);
  };

  const openEditModal = (menu: MenuItem) => {
    setEditMenu(menu);
    setData({ name: menu.name, category: menu.category || '', price: menu.price.toString(), image: null });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMenu(null);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', data.price);
    if (data.image) formData.append('image', data.image);
    const fetchOptions = {
      method: editMenu ? 'POST' : 'POST',
      credentials: 'include' as RequestCredentials,
      body: formData,
    };
    if (editMenu) {
      await fetch(`/admin/menu/${editMenu.id}?_method=PUT`, fetchOptions);
      closeModal();
    } else {
      await fetch('/admin/menu', fetchOptions);
      closeModal();
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this menu item?')) {
      router.post(`/admin/menu/${id}`, { _method: 'DELETE' });
    }
  };

  // Remove unused handleLogout, use sidebar logout form instead

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f6f2' }}>
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
          {/* <img src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?..." alt="Logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} /> */}
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
                color: (link.name === 'Menu List') ? '#f8c471' : '#fff',
                background: (link.name === 'Menu List') ? '#3b2012' : 'transparent',
                textDecoration: 'none',
                fontWeight: (link.name === 'Menu List') ? 600 : 400,
                fontSize: 16,
                borderLeft: (link.name === 'Menu List') ? '4px solid #f8c471' : '4px solid transparent',
                transition: 'background 0.2s',
                cursor: 'pointer',
                marginBottom: 4,
              }}
              onClick={() => setActive(link.name)}
            >
              <span style={{ marginRight: 16, fontSize: 20 }}>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Logout button above copyright footer */}
        <form
          onSubmit={e => {
            e.preventDefault();
            fetch('/admin/logout', { method: 'POST', credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' } })
              .then(() => window.location.href = '/');
          }}
          style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}
        >
          <button
            type="submit"
            className="w-11/12 mb-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition"
            style={{ margin: '0 auto', display: 'block' }}
          >
            Log out
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: 12, marginTop: 8, color: '#e0cfc2' }}>
          &copy; {new Date().getFullYear()} Al-Fateh Steakhouse
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 40px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#4e2e1e', marginBottom: 16 }}>Menu List</h2>
        <button
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-bold"
          onClick={openAddModal}
        >
          + Add Menu
        </button>
        <table className="w-full border border-separate border-spacing-0" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-r border-gray-300 w-1/4 text-left">Name</th>
              <th className="p-2 border-r border-gray-300 w-1/4 text-left">Category</th>
              <th className="p-2 border-r border-gray-300 w-24 text-center">Price</th>
              <th className="p-2 border-r border-gray-300 w-24 text-center">Image</th>
              <th className="p-2 w-32 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map(menu => (
              <tr key={menu.id} className="border-t border-gray-300">
                <td className="p-2 border-r border-gray-200 align-middle truncate" title={menu.name}>{menu.name}</td>
                <td className="p-2 border-r border-gray-200 align-middle truncate" title={menu.category || ''}>{menu.category || '-'}</td>
                <td className="p-2 border-r border-gray-200 align-middle text-center">RM{Number(menu.price).toFixed(2)}</td>
                <td className="p-2 border-r border-gray-200 text-center align-middle">
                  {menu.image && (
                    <img src={`/storage/${menu.image}`} alt={menu.name} className="h-16 w-16 object-cover rounded mx-auto" style={{ display: 'block', margin: '0 auto' }} />
                  )}
                </td>
                <td className="p-2 align-middle text-center">
                  <button
                    className="mr-2 text-blue-600 hover:underline"
                    onClick={() => openEditModal(menu)}
                  >Edit</button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(menu.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >✕</button>
              <h3 className="text-xl font-bold mb-4">{editMenu ? 'Edit Menu' : 'Add Menu'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold">Category</label>
                  <input
                    type="text"
                    value={data.category}
                    onChange={e => setData('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold">Price</label>
                  <input
                    type="number"
                    value={data.price}
                    onChange={e => setData('price', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    min={0}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                    className="w-full"
                  />
                  {editMenu && editMenu.image && (
                    <img src={`/storage/${editMenu.image}`} alt="Current" className="h-16 w-16 object-cover rounded mt-2" />
                  )}
                </div>
                {errors && (
                  <div className="text-red-600 text-sm">
                    {Object.values(errors).map((err, i) => (
                      <div key={i}>{err}</div>
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-bold w-full"
                >
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

/*
  Example usage: <button onClick={handleLogout}>Logout</button>
*/
