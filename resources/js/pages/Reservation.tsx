import { useForm, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function Reservation() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    reservation_date: '',
    reservation_time: '',
    guests: 1,
  });

  const { props } = usePage();
  const flash = props.flash as { success?: string };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('reservation.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center font-sans" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504754524776-8f4f37790774?q=80&w=2940&auto=format&fit=crop')" }}
    >
      <Head title="Reservation" />

      <div className="bg-black/60 min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center p-8 bg-black/50 text-xl justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 mr-8">
            <img 
              src="https://scontent.fkul10-1.fna.fbcdn.net/v/t39.30808-6/239936175_342324124259247_2241240302739337307_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OiPobw0uxKEQ7kNvwFpCej5&_nc_oc=AdnySHY-p4vNJ_WilO7nLkiPgWvv8X1yqA2MWyvPRo3pO_bKHdAalHT6Yxl6kOHL9E8&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=HtED01grQpvthOczf0nTUg&oh=00_AfM4d7K-cw-qeMA6bI1pM1OKfNk9DtFmeUk8FirU59BUGw&oe=68683232" 
              alt="Al-Fateh Logo" 
              className="h-10 w-10 rounded-lg" 
            />
            <span className="text-2xl font-bold uppercase text-white">Al-Fateh</span>
          </a>
          {/* Links */}
          <div className="flex items-center gap-6 text-lg">
            <a href="/" className="text-white hover:text-orange-300">Home</a>
            <a href="/menu" className="text-white hover:text-orange-300">Menu</a>
            <a href="/reservation" className="text-white hover:text-orange-300">Reservation</a>
            <a href="/review" className="text-white hover:text-orange-300">Review</a>
            <a href="/about" className="text-white hover:text-orange-300">About</a>
            <button 
              onClick={() => router.visit('/login')} 
              className="text-white hover:text-orange-300 ml-4"
              title="Login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto p-8 my-10 bg-amber-100 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 uppercase tracking-wider">
            Reserve Your Table
          </h2>

          {/* Success Message */}
          {flash?.success && (
            <div className="mb-4 text-green-600 font-semibold text-center">
              {flash.success}
            </div>
          )}

          {/* Validation Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 text-red-600 text-sm">
              <ul>
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reservation Form */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="block font-semibold text-gray-800">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800">Date</label>
              <input
                type="date"
                value={data.reservation_date}
                onChange={(e) => setData('reservation_date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800">Time</label>
              <input
                type="time"
                value={data.reservation_time}
                onChange={(e) => setData('reservation_time', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800">Guests</label>
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
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded font-bold tracking-wide uppercase shadow hover:shadow-lg transition-all duration-300"
            >
              Reserve Now
            </button>
          </form>
        </main>

        {/* Footer */}
        <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">
          &copy; 2025 Alfateh Steak House &mdash; Designed by Akatsuci
        </footer>
      </div>
    </div>
  );
}
