import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Pagination, Palete } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Paletes | Listagem',
        href: 'gestao-paletes/listar',
    },
];

interface Props {
    paletes: Pagination<Palete>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function GestaoPaletes({ paletes, flash }: Props) {
    function handlePageChange(url: string | null) {
        if (!url) return;
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    }

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
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable
                        columns={columns}
                        data={paletes.data}
                        pagination={{
                            currentPage: paletes.current_page,
                            lastPage: paletes.last_page,
                            nextPageUrl: paletes.next_page_url,
                            prevPageUrl: paletes.prev_page_url,
                            onPageChange: handlePageChange,
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
