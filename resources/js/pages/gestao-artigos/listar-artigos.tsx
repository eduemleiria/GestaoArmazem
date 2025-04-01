import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Artigo, columns } from './columns';
import { DataTable } from './data-table';
import { Input } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Artigos | Listagem',
        href: 'gestao-artigos/listar',
    },
];

interface PageProps {
    artigos: Artigo[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function GestaoArtigos() {
    const { artigos, flash } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Artigos | Lista" />
            {flash?.success && (
                <Alert className="mt-2 bg-lime-100">
                    <AlertTitle>Sucesso!</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}
            {flash?.error && (
                <Alert className="mt-2 bg-red-300">
                    <AlertTitle>Erro!</AlertTitle>
                    <AlertDescription className="text-black">{flash.error}</AlertDescription>
                </Alert>
            )}

            <div className="flex justify-between p-2">
                <div className="flex">
                    <Button asChild className="bg-green-400 hover:bg-green-500 hover:text-black">
                        <Link href="/gestao-artigos/adicionar">Adicionar Artigo</Link>
                    </Button>
                </div>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable columns={columns} data={artigos} />
                </div>
            </div>
        </AppLayout>
    );
}
