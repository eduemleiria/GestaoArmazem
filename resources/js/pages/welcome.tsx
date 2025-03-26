import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import NavBar from '@/components/nav-homepage';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <NavBar />
            <div className="w-screen h-screen flex justify-left items-center">
                <h1 className="font-bold text-8xl text-lime-300">Armazenagem</h1>
                <h1 className="font-bold text-8xl text-gray-300">é connosco.</h1>
            </div>
        </>
    );
}
