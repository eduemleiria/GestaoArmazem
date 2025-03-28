import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import NavBar from "@/components/nav-homepage";

export default function SobreNos() {
    return(
        <>
        <Head title="Sobre Nós">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=Alexandria:400,500,600" rel="stylesheet" />
        </Head>
        <div>
            <NavBar />
            <p>Isto é o sobre nós</p>
        </div>
        </>
    );
}