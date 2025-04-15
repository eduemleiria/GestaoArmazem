import NavBar from '@/components/nav-homepage';
import { Head } from '@inertiajs/react';

export default function Servicos() {
    return (
        <>
            <Head title="Servicos">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <NavBar />
            <h1>Isto é a pagina de servicos</h1>
        </>
    );
}
