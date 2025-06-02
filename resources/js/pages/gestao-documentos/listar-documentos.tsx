import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Documento, Pagination, PaginationProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Documentos | Listagem',
        href: 'gestao-documentos/listar',
    },
];

interface PageProps {
    documentos: Pagination<Documento>;
    flash?: {
        success?: string;
        error?: string;
    };
}

interface PaginatedResult {
    data: Documento[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export default function GestaoDocumentos({ documentos, flash }: PageProps) {
    const [search, setSearch] = useState('');
    const [paginatedData, setPaginatedData] = useState<PaginatedResult | null>(null);
    const [initialData, setInitialData] = useState<Documento[]>([]);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);

    useEffect(() => {
        if (documentos) {
            setInitialData(documentos.data);
            setPagination({
                currentPage: documentos.current_page,
                lastPage: documentos.last_page,
                nextPageUrl: documentos.next_page_url,
                prevPageUrl: documentos.prev_page_url,
                onPageChange: handlePageChange,
            });
        }
    }, [documentos]);

    const onSearchChange = (value: string) => {
        setSearch(value);

        if (!value) {
            setPaginatedData(null);
            return;
        }

        axios
            .get(`/gestao-documentos/procurar/${value}`)
            .then((res) => {
                setPaginatedData(res.data);
            })
            .catch(console.error);
    };

    const onPageChange = (url: string | null) => {
        if (!url) return;

        if (search) {
            axios
                .get(url)
                .then((res) => {
                    setPaginatedData(res.data);
                })
                .catch(console.error);
        } else {
            return;
        }
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
