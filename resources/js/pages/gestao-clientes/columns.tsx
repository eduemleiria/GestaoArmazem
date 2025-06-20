import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, EditIcon, MoreHorizontal, X } from 'lucide-react';
import DeleteClienteDialog from '@/components/delete-cliente-dialog';
import { Cliente } from '@/types';

export const columns: ColumnDef<Cliente>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'nome',
        header: 'Nome',
    },
    {
        accessorKey: 'morada',
        header: 'Morada',
    },
    {
        accessorKey: 'acesso',
        header: () => <div className="text-center">Acesso há API</div>,
        cell: ({ row }) => {
            const acesso: string = row.getValue('acesso');
            if (acesso == 'Com acesso') {
                return (
                    <div className="mx-auto flex w-27 items-center justify-center rounded bg-lime-400 text-right font-bold">
                        <CheckIcon className="w-5 pr-1" />
                        {acesso}
                    </div>
                );
            } else if (acesso == 'Sem acesso') {
                return (
                    <div className="mx-auto flex w-27 items-center justify-center rounded bg-red-400 text-right font-bold">
                        <X className="w-5 pr-1" />
                        {acesso}
                    </div>
                );
            }
        },
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
                            <Link href={route('editar-cliente.edit', row.original.id)}>
                                <EditIcon className="mr-2" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteClienteDialog clienteId={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
