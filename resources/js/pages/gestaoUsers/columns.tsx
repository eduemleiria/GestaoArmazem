import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteUserDialog from '@/components/delete-user-dialog';

export type Cliente = {
    id: string;
    name: string;
    email: string;
    created_at: Date;
};

export const columns: ColumnDef<Cliente>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'name',
        header: 'Nome',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'created_at',
        header: () => 'Juntou-se dia',
        cell: ({ row }) => {
            const dia: any = row.getValue('created_at');

            const formatted = new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'Europe/Lisbon',
            }).format(new Date(dia));

            return <div className="font-medium">{formatted}</div>;
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
                            <Link href={route('editar.edit', row.original.id)}>
                                <EditIcon className="mr-2" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteUserDialog userId={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
