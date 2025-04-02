import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Documento, columns } from './columns';
import { DataTable } from './data-table';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Documentos | Listagem',
        href: 'gestao-documentos/listar',
    },
];

interface PageProps {
    documentos: Documento[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function GestaoDocumentos() {
    const { documentos, flash } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Documentos | Lista" />
            {flash?.success && (
                <Alert className="mt-2 bg-lime-100">
                    <AlertTitle>Sucesso!</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}
            {flash?.error && (
                <Alert className="mt-2 bg-red-300">
                    <AlertTitle>Erro!</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}

            <div className="p-2">
                <Button asChild className="bg-green-400 hover:bg-green-500 hover:text-black">
                    <Link href="/gestao-documentos/adicionar">Adicionar documento</Link>
                </Button>
            </div>
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable columns={columns} data={documentos} />
                </div>
            </div>
        </AppLayout>
    );
}
