import AdminLayout from '@/layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

interface Reservation {
    id: number;
    name: string;
    email: string;
    phone: string;
    reservation_date: string;
    reservation_time: string;
    guests: number;
    created_at: string;
    status?: string;
    // special_request field removed
    [key: string]: unknown;
}

interface PageProps {
    reservations: Reservation[];
    [key: string]: unknown;
}

const AdminReservations: React.FC = () => {
    const { reservations = [] } = usePage<PageProps>().props;
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const deleteReservation = (id: number) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            router.delete(`/admin/reservations/${id}`);
        }
    };

    const openEditModal = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingReservation(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingReservation) return;

        const { name, value } = e.target;
        setEditingReservation({
            ...editingReservation,
            [name]: name === 'guests' ? parseInt(value) : value,
        });
    };

    const submitEdit = () => {
        if (!editingReservation) return;

        // Payload no longer includes special_request
        const payload = {
            name: editingReservation.name,
            email: editingReservation.email,
            phone: editingReservation.phone,
            reservation_date: editingReservation.reservation_date,
            reservation_time: editingReservation.reservation_time,
            guests: editingReservation.guests,
        };

        router.put(`/admin/reservations/${editingReservation.id}`, payload, {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(now.getDate() + 7);

    const parseDateTime = (res: Reservation) => {
        return new Date(`${res.reservation_date}T${res.reservation_time}`);
    };

    const sortedReservations = [...reservations].sort((a, b) => parseDateTime(a).getTime() - parseDateTime(b).getTime());

    const todayReservations = sortedReservations.filter((r) => r.reservation_date === today);

    const weekReservations = sortedReservations.filter((r) => {
        const dt = parseDateTime(r);
        return r.reservation_date !== today && dt >= now && dt <= weekEnd;
    });

    const upcomingReservations = sortedReservations.filter((r) => {
        const dt = parseDateTime(r);
        return dt > weekEnd;
    });

    const renderRows = (resList: Reservation[]) =>
        resList.map((res) => (
            <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 text-gray-800">{res.name}</td>
                <td className="p-3 text-gray-800">{res.email}</td>
                <td className="p-3 text-gray-800">{res.phone}</td>
                <td className="p-3 text-gray-800">{res.reservation_date}</td>
                <td className="p-3 text-gray-800">{res.reservation_time}</td>
                <td className="p-3 text-center text-gray-800">{res.guests}</td>
                <td className="p-3 text-sm text-gray-600">{new Date(res.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => openEditModal(res)}
                            className="rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteReservation(res.id)}
                            className="rounded bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        ));

    return (
        <AdminLayout currentPage="Reservation List">
            {/* Edit Modal */}
            {isModalOpen && editingReservation && (
                <div className="bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">Edit Reservation</h2>

                        <div className="space-y-4 text-gray-800">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingReservation.name}
                                    onChange={handleInputChange}
                                    className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editingReservation.email}
                                    onChange={handleInputChange}
                                    className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editingReservation.phone}
                                    onChange={handleInputChange}
                                    className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="reservation_date"
                                        value={editingReservation.reservation_date}
                                        onChange={handleInputChange}
                                        className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
                                    <input
                                        type="time"
                                        name="reservation_time"
                                        value={editingReservation.reservation_time}
                                        onChange={handleInputChange}
                                        className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Number of Guests</label>
                                <input
                                    type="number"
                                    name="guests"
                                    min="1"
                                    value={editingReservation.guests}
                                    onChange={handleInputChange}
                                    className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Special Request Textarea has been removed */}

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={closeModal}
                                    className="rounded bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitEdit}
                                    className="rounded bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Reservation Management</h1>
                <p className="text-gray-600">View all customer reservations</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="p-3 font-semibold text-gray-600">Name</th>
                                <th className="p-3 font-semibold text-gray-600">Email</th>
                                <th className="p-3 font-semibold text-gray-600">Phone</th>
                                <th className="p-3 font-semibold text-gray-600">Reservation Date</th>
                                <th className="p-3 font-semibold text-gray-600">Time</th>
                                <th className="p-3 text-center font-semibold text-gray-600">Guests</th>
                                <th className="p-3 font-semibold text-gray-600">Booked At</th>
                                <th className="p-3 text-center font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500 italic">
                                        No reservations found
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {todayReservations.length > 0 && (
                                        <>
                                            <tr>
                                                <td colSpan={8} className="bg-emerald-50 p-3 font-bold text-emerald-600">
                                                    🟢 Today's Reservations ({todayReservations.length})
                                                </td>
                                            </tr>
                                            {renderRows(todayReservations)}
                                        </>
                                    )}

                                    {weekReservations.length > 0 && (
                                        <>
                                            <tr>
                                                <td colSpan={8} className="bg-amber-50 p-3 font-bold text-amber-600">
                                                    📆 This Week's Reservations ({weekReservations.length})
                                                </td>
                                            </tr>
                                            {renderRows(weekReservations)}
                                        </>
                                    )}

                                    {upcomingReservations.length > 0 && (
                                        <>
                                            <tr>
                                                <td colSpan={8} className="bg-gray-50 p-3 font-bold text-gray-600">
                                                    📅 Upcoming Reservations ({upcomingReservations.length})
                                                </td>
                                            </tr>
                                            {renderRows(upcomingReservations)}
                                        </>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReservations;
