import DeleteClienteDialog from '@/components/delete-cliente-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontal } from 'lucide-react';

export type Documento = {
    id: string;
    estado: string;
    tipoDoc: string;
    dataChegada: string;
    dataSaida: string;
    moradaC: string;
    moradaD: string;
    matricula: string;
    nomeCliente: string;
};

export const columns: ColumnDef<Documento>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
    },
    {
        accessorKey: 'tipoDoc',
        header: 'Tipo de Documento',
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
                            <Link href={route('editar.edit', row.original.id)}>
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
