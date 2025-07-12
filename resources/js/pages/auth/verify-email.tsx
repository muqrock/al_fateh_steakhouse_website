import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';

export default function VerifyEmail() {
    const { post, processing } = useForm({});

    const resendEmail = () => {
        post(route('verification.send'));
    };

    const logout = () => {
        post(route('logout'));
    };

    return (
        <AuthLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If
                you didn't receive the email, we will gladly send you another.
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={resendEmail}
                    disabled={processing}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                    Resend Verification Email
                </button>

                <button onClick={logout} className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500">
                    Log Out
                </button>
            </div>
        </AuthLayout>
    );
}
