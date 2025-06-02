import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
    onPageChange: (url: string | null) => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: PaginationProps;
}

export function DataTable<TData, TValue>({ columns, data, pagination }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table className="text-center">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sem registos...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <div className="flex items-center justify-end space-x-2 p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.prevPageUrl)}
                        disabled={!pagination.prevPageUrl}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm">
                        Página {pagination.currentPage} de {pagination.lastPage}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.nextPageUrl)}
                        disabled={!pagination.nextPageUrl}
                    >
                        Próximo
                    </Button>
                </div>
            )}
        </div>
    );
}
