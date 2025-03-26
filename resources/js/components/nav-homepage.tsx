import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function NavBar() {
    const { auth } = usePage<SharedData>().props;
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=Alexandria:400,500,600" rel="stylesheet" />
            </Head>
            <nav className="flex items-center justify-between p-3">
                <Link
                    href={route('home')}
                    className="text-xl font-bold text-black"
                >
                    QuickShelf
                </Link>    
                <div className="flex justify-start ml-10">
                    <Link
                        href={route('servicos')}
                        className="hover:underline"
                    >
                        Serviços
                    </Link>    
                </div>
                <div className="flex justify-start ml-5">
                    <Link
                        href={route('precos')}
                        className="hover:underline"
                    >
                        Preços
                    </Link>    
                </div>
                <div className="flex justify-start ml-5">
                    <Link
                        href={route('contactos')}
                        className="hover:underline"
                    >
                        Contactos
                    </Link>    
                </div>
                <div className="flex justify-start ml-5">
                    <Link
                        href={route('sobre-nos')}
                        className="hover:underline"
                    >
                        Sobre Nós
                    </Link>    
                </div>
                
                <div className="flex space-x-4 ml-auto">
                    {auth.user ? (
                    <>
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-sm border border-[#19140025] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    </>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent bg-lime-100 px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] hover:bg-lime-200 dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};
