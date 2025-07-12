import CustomerLayout from '@/layouts/CustomerLayout';
import { router } from '@inertiajs/react';

export default function HomePage() {
    const handleSeeMenu = () => {
        router.visit('/menu'); // Navigates to the menu page
    };

    return (
        <CustomerLayout
            currentPage="home"
            transparentNav={true}
            fullHeight={true}
            backgroundImage="https://scontent.fkul16-1.fna.fbcdn.net/v/t39.30808-6/480592153_1120290986462553_3246017696480109358_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=36i0no1h3BgQ7kNvwGuMD4d&_nc_oc=AdnDv37NMlLXQ3KBi7AkKkMSG9L9ZPFsWiqwRQNvcOTJj73CPyfr_AysQ14AfWHYINk&_nc_zt=23&_nc_ht=scontent.fkul16-1.fna&_nc_gid=aSZCA_P5oJ83o0di-1Fbbg&oh=00_AfSQZjrh9acw4Dj51ywd_8WshHyDX6PW0GZ2N8Hwdukdfg&oe=68753153"
            title="Home"
        >
            {/* Main Content - Centered */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-5 text-center">
                {/* Restaurant Name */}
                <div className="mb-5">
                    <h1 className="m-0 text-6xl leading-none font-bold md:text-7xl">Al-Fateh</h1>
                    <h1 className="m-0 text-6xl leading-none font-bold md:text-7xl">Steak House</h1>
                </div>

                {/* Tagline */}
                <p className="mb-6 text-2xl italic">Serving The Best Western Food For Our Lovely Customer</p>

                {/* Opening Hours */}
                <div className="mb-8">
                    <h3 className="mb-2 text-xl font-semibold text-orange-200">Opening Hours</h3>
                    <p className="text-lg text-white">3:00 PM - 11:00 PM Every Day</p>
                </div>

                {/* Menu Button */}
                <button
                    className="cursor-pointer rounded-lg border-none bg-orange-500 px-8 py-4 text-lg font-bold tracking-wider text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/50 focus:ring-4 focus:ring-orange-400 focus:outline-none"
                    onClick={handleSeeMenu}
                >
                    See Our Menu!
                </button>
            </div>

            {/* Footer */}
            <footer className="relative z-10 bg-black/70 py-4 text-center text-sm text-white">
                &copy; {new Date().getFullYear()} Al-Fateh Steak House &mdash; Designed by Akatsuci
            </footer>
        </CustomerLayout>
    );
}
