import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Documento } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { columns } from './columns';
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

export default function GestaoDocumentos({ documentos, flash }: PageProps) {
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
                <div>
                    <DataTable columns={columns} data={documentos} />
                </div>
            </div>
        </AppLayout>
    );
}
