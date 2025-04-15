import DeleteDocumentoDialog from '@/components/delete-documento-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Palete } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontal, SearchIcon } from 'lucide-react';
import { useState } from 'react';

export const columns: ColumnDef<Palete>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'clienteArtigo',
        header: 'Cliente',
    },
    {
        accessorKey: 'nomeArtigo',
        header: 'Artigo',
    },
    {
        accessorKey: 'quantidade',
        header: 'Quantidade',
    },
    {
        accessorKey: 'localizacao',
        header: 'Localização',
    },
    {
        accessorKey: 'dataEntrada',
        header: 'Data de Entrada',
    },
    {
        id: 'actions',
        header: () => 'Ações',
        cell: ({ row }) => {
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const getEstado = (estado: any): any => {
                switch (estado) {
                    case 'Pendente':
                        return { editable: 'false' };
                    case 'Concluído':
                        return { editable: 'true' };
                    default:
                        return { editable: '' };
                }
            };

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
                            <Link href={route('detalhes-doc.show', row.original.id)}>
                                <SearchIcon className="mr-2" />
                                Detalhes
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('editar-documento.edit', row.original.id)}>
                                <EditIcon className="mr-2" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteDocumentoDialog documentoId={row.original.id} onDelete={() => setDropdownOpen(false)} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
