import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import NavBar from '@/components/nav-homepage';

export default function Welcome() {
    return (
        <>
            <Head title="Contactos">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <NavBar />
            <h1>Isto é a página dos contactos</h1>
        </>
    );
}
