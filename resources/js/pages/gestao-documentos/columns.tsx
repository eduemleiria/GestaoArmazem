import DeleteDocumentoDialog from '@/components/delete-documento-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Documento } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, Clock10Icon, EditIcon, FileDown, MoreHorizontal, SearchIcon } from 'lucide-react';
import { useState } from 'react';

export const columns: ColumnDef<Documento>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'nomeCliente',
        header: 'Cliente',
    },
    {
        accessorKey: 'tipoDoc',
        header: 'Tipo de Documento',
    },
    {
        accessorKey: 'data',
        header: 'Data do Acontecimento Previsto',
    },
    {
        accessorKey: 'dataEmissao',
        header: 'Data de Emissão',
    },
    {
        accessorKey: 'estado',
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const estado: string = row.getValue('estado');
            if (estado == 'Concluído') {
                return (
                    <div className="mx-auto flex w-27 items-center justify-center rounded bg-lime-400 text-right font-bold">
                        <CheckIcon className="w-5 pr-1" />
                        {estado}
                    </div>
                );
            } else if (estado == 'Pendente') {
                return (
                    <div className="mx-auto flex w-27 items-center justify-center rounded bg-yellow-300 text-right font-bold">
                        <Clock10Icon className="w-5 pr-1" />
                        {estado}
                    </div>
                );
            }
        },
    },
    {
        id: 'actions',
        header: () => 'Ações',
        cell: function Cell({ row }) {
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const getEstado = (estado: string) => {
                switch (estado) {
                    case 'Pendente':
                        return { editable: false };
                    case 'Concluído':
                        return { editable: true };
                    default:
                        return { editable: false };
                }
            };
            const estadoAgr = getEstado(row.original.estado);

            const getTipoDoc = (tipoDoc: string, estado: string) => {
                if (tipoDoc == 'Documento de Saída') {
                    return (
                        <>
                            <DropdownMenuItem asChild disabled={estado == 'Concluído' ? false : true}>
                                <a href={route('documento-pdf.download', row.original.id)} target="_blank" rel="noopener noreferrer">
                                    <FileDown className="mr-2" />
                                    Download PDF
                                </a>
                            </DropdownMenuItem>
                        </>
                    );
                }
            };

            const tipoDocAgr = getTipoDoc(row.original.tipoDoc, row.original.estado);

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
                        <DropdownMenuItem asChild disabled={estadoAgr.editable}>
                            <Link href={route('editar-documento.edit', row.original.id)}>
                                <EditIcon className="mr-2" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        {tipoDocAgr}
                        <DropdownMenuItem asChild>
                            <DeleteDocumentoDialog documentoId={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
