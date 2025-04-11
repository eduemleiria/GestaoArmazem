import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontal } from 'lucide-react';
import DeleteArtigoDialog from '@/components/delete-artigo-dialog';
import { Artigo } from '@/types';

export const columns: ColumnDef<Artigo>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'nome',
        header: 'Nome',
    },
    {
        accessorKey: 'nomeCliente',
        header: 'Cliente',
    },
    {
        id: 'actions',
        header: () => 'Ações',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('editar-artigo.edit', row.original.id)}>
                                <EditIcon className="mr-2" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteArtigoDialog artigoId={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
