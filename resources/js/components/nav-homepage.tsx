import { type SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

export default function NavBar() {
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=Alexandria:400,500,600" rel="stylesheet" />
            </Head>
            <div className={`sticky top-0 z-50 flex items-center justify-between rounded-b-lg bg-white p-4`}>
                <Link href={route('home')} className={`text-xl font-bold text-black`}>
                    QuickShelf
                </Link>
                <div className="ml-10 flex justify-start">
                    <Link href={route('servicos')} className={`text-black hover:underline`}>
                        Serviços
                    </Link>
                </div>
                <div className="ml-5 flex justify-start">
                    <Link href={route('precos')} className={`text-black hover:underline`}>
                        Preços
                    </Link>
                </div>
                <div className="ml-5 flex justify-start">
                    <Link href={route('contactos')} className={`text-black hover:underline`}>
                        Contactos
                    </Link>
                </div>
                <div className="ml-5 flex justify-start">
                    <Link href={route('sobre-nos')} className={`text-black hover:underline`}>
                        Sobre Nós
                    </Link>
                </div>

                <div className="ml-auto flex space-x-4">
                    {auth.user ? (
                        <>
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140025] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                            <Link className="text-sm hover:underline" method="post" href={route('logout')} as="button" onClick={cleanup}>
                                Log out
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent bg-lime-100 px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] hover:bg-lime-400 dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            {/*<Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>*/}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
