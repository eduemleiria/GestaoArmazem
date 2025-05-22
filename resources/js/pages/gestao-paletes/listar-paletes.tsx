import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Palete } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Paletes | Listagem',
        href: 'gestao-paletes/listar',
    },
];

interface PageProps {
    paletes: Palete[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function GestaoPaletes({ paletes, flash }: PageProps) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Paletes | Lista" />
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
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div>
                    <DataTable columns={columns} data={paletes} />
                </div>
            </div>
        </AppLayout>
    );
}
