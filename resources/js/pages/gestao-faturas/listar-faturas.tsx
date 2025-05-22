import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Fatura } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Faturas | Listagem',
        href: 'gestao-faturas/listar',
    },
];

interface Props {
    faturas: Fatura[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ListarFaturas({ faturas, flash }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Faturas | Lista" />
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
                    <Link href="/gestao-faturas/adicionar">Adicionar Fatura</Link>
                </Button>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div>
                    <DataTable columns={columns} data={faturas} />
                </div>
            </div>
        </AppLayout>
    );
}
