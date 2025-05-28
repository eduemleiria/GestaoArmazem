import DeleteDocumentoDialog from '@/components/delete-documento-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Fatura } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontal, SearchIcon } from 'lucide-react';
import { useState } from 'react';

export const columns: ColumnDef<Fatura>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'nomeCliente',
        header: 'Cliente',
    },
    {
        accessorKey: 'dataEmissao',
        header: 'Data de Emissão',
    },
    {
        accessorKey: 'dataInicio',
        header: 'Inicio',
    },
    {
        accessorKey: 'dataFim',
        header: 'Fim',
    },
    {
        accessorKey: 'total',
        header: () => <div>Total</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('total'));
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        id: 'actions',
        header: () => 'Ações',
        cell: function Cell({ row }) {
            const [dropdownOpen, setDropdownOpen] = useState(false);
            return (
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('detalhes-fatura.show', row.original.id)}>
                                <SearchIcon className="mr-2" />
                                Detalhes
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteDocumentoDialog documentoId={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
