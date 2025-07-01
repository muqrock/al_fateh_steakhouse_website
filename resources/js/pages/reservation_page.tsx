import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Reservation() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    reservation_date: '',
    reservation_time: '',
    guests: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('reservation.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Reservation', href: '/reservation' }]}>
      <Head title="Reservation" />

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Reserve Your Table</h2>

        {Object.keys(errors).length > 0 && (
          <div className="mb-4 text-red-600">
            <ul>
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {window.flash?.success && (
          <div className="mb-4 text-green-600 font-semibold">
            {window.flash.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Date</label>
            <input
              type="date"
              value={data.reservation_date}
              onChange={(e) => setData('reservation_date', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Time</label>
            <input
              type="time"
              value={data.reservation_time}
              onChange={(e) => setData('reservation_time', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Guests</label>
            <input
              type="number"
              min={1}
              value={data.guests}
              onChange={(e) => setData('guests', Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-bold"
          >
            Reserve Now
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
