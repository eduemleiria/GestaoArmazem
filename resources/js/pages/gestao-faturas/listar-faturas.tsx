import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Fatura, Pagination, PaginationProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Faturas | Listagem',
        href: 'gestao-faturas/listar',
    },
];

interface PaginatedResult {
    data: Fatura[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    faturas: Pagination<Fatura>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ListarFaturas({ faturas, flash }: Props) {
    const [search, setSearch] = useState('');
    const [paginatedData, setPaginatedData] = useState<PaginatedResult | null>(null);
    const [initialData, setInitialData] = useState<Fatura[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);

    useEffect(() => {
        if (faturas) {
            setInitialData(faturas.data);
            setPagination({
                currentPage: faturas.current_page,
                lastPage: faturas.last_page,
                nextPageUrl: faturas.next_page_url,
                prevPageUrl: faturas.prev_page_url,
                onPageChange: handlePageChange,
            });
        }
    }, [faturas]);

    const onSearchChange = (value: string) => {
        setSearch(value);
        
        if (!value) {
            setPaginatedData(null);
            return;
        }

        axios
            .get(`/gestao-faturas/procurar/${value}`)
            .then((res) => {
                console.log(res.data);
                setPaginatedData(res.data);
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
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-96"
                        placeholder="Insira o valor que procura..."
                    />
                </div>
                <div>
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
