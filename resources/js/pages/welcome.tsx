import NavBar from '@/components/nav-homepage';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Bem-Vindo">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative h-screen w-full bg-neutral-700">
                <NavBar />
                <img src="/wearhousebg2.jpg" className="absolute inset-0 h-full w-full object-cover mix-blend-overlay" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-8xl font-bold text-lime-400">Armazenagem</h1>
                    <h2 className="text-7xl font-bold text-zinc-300">é connosco.</h2>
                </div>
            </div>
            <div className="rounded-b-lg">
                <h2 className="p-5 text-center text-2xl font-bold">mais texto por aqui</h2>
                <div></div>
            </div>
        </>
    );
}
