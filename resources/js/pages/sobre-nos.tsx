import NavBar from '@/components/nav-homepage';
import { Head } from '@inertiajs/react';

export default function SobreNos() {
    return (
        <>
            <Head title="Sobre Nós">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=Alexandria:400,500,600" rel="stylesheet" />
            </Head>
            <div>
                <NavBar />
                <p>Isto é o sobre nós</p>
                <div className=""></div>
            </div>
        </>
    );
}
