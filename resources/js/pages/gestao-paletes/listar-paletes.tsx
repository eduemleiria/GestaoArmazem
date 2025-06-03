import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Pagination, PaginationProps, Palete } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Paletes | Listagem',
        href: 'gestao-paletes/listar',
    },
];

export interface PaginatedResult {
    data: Palete[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    paletes: Pagination<Palete>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function GestaoPaletes({ paletes, flash }: Props) {
    const [search, setSearch] = useState('');
    const [paginatedData, setPaginatedData] = useState<PaginatedResult | null>(null);
    const [initialData, setInitialData] = useState<Palete[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);

    useEffect(() => {
        if (paletes) {
            setInitialData(paletes.data);
            setPagination({
                currentPage: paletes.current_page,
                lastPage: paletes.last_page,
                nextPageUrl: paletes.next_page_url,
                prevPageUrl: paletes.prev_page_url,
                onPageChange: handlePageChange,
            });
        }
    }, [paletes]);

    const onSearchChange = (value: string) => {
        setSearch(value);

        if (!value) {
            setPaginatedData(null);
            return;
        }

        axios
            .get(`/gestao-paletes/procurar/${value}`)
            .then((res) => {
                setPaginatedData(res.data);
                console.log(res.data);
            })
            .catch(console.error);
    };

    const onPageChange = (url: string | null) => {
        if (!url) return;

        const urlObj = new URL(url, window.location.origin);
        urlObj.searchParams.set('search', search);

        axios
            .get(urlObj.toString())
            .then((res) => {
                setPaginatedData(res.data);
            })
            .catch(console.error);
    };

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
                <div className='pt-2'>
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-100"
                        placeholder="Insire aqui o que pesquisa..."
                    />
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable
                        columns={columns}
                        data={paginatedData?.data || initialData}
                        pagination={
                            paginatedData
                                ? {
                                      currentPage: paginatedData.current_page,
                                      lastPage: paginatedData.last_page,
                                      nextPageUrl: paginatedData.next_page_url,
                                      prevPageUrl: paginatedData.prev_page_url,
                                      onPageChange,
                                  }
                                : pagination
                        }
                    />
                </div>
            </div>
        </AppLayout>
    );
}
