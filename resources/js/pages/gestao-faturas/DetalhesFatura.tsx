import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Fatura, LinhaFatura } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Documentos | Detalhes',
        href: '/detalhes-doc',
    },
];

type Props = {
    fatura: Fatura;
    linhasFatura: LinhaFatura[];
};

export default function DetalhesFatura({ fatura, linhasFatura }: Props) {



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Faturas | Detalhes" />
            <div className="m-4">
                <h1 className="font-bold">Fatura #{fatura.id}</h1>
                <div className='mt-4'>
                    <div className="flex">
                        <h3 className="font-bold">Cliente: </h3>
                        <h3 className="ml-2">{fatura.nomeCliente}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="font-bold">Data de Inicio: </h3>
                        <h3 className="ml-2">{fatura.dataInicio}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="font-bold">Data Final: </h3>
                        <h3 className="ml-2">{fatura.dataFim}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="font-bold">Data de Emissão: </h3>
                        <h3 className="ml-2">{fatura.dataEmissao}</h3>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="font-bold">Paletes faturadas:</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">ID</TableHead>
                                <TableHead className="text-center">ID da Palete</TableHead>
                                <TableHead className="text-center">Artigo</TableHead>
                                <TableHead className="text-center">Data de Entrada da Palete</TableHead>
                                <TableHead className="text-center">Data de Saída da Palete</TableHead>
                                <TableHead className="text-center">Quantidade</TableHead>
                                <TableHead className="text-center">Dias no armazém</TableHead>
                                <TableHead className="text-center">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {linhasFatura.map((linha: LinhaFatura) => (
                                <TableRow>
                                    <TableCell className="text-center">{linha.id}</TableCell>
                                    <TableCell className="text-center">{linha.idPalete}</TableCell>
                                    <TableCell className="text-center">{linha.nomeArtigo}</TableCell>
                                    <TableCell className="text-center">{linha.dataEntrada}</TableCell>
                                    <TableCell className="text-center">{linha.quantidade}</TableCell>
                                    <TableCell className="text-center">{linha.dias}</TableCell>
                                    <TableCell className="text-center">{linha.subtotal} €</TableCell>
                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell className="text-right font-bold text-base">Total:</TableCell>
                                <TableCell className="text-center">{fatura.total} €</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
