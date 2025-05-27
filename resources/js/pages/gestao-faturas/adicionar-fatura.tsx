import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Cliente, LinhaFaturaProvisoria } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Faturas | Adicionar',
        href: '/adicionar-fatura',
    },
];

interface Props {
    clientes: Cliente[];
    LinhaFaturaProvisoria: LinhaFaturaProvisoria[];
}
const formSchema = z.object({
    idCliente: z.string().min(1, 'Selecione um cliente válido!').max(190),
    dataI: z.string(),
    dataF: z.string(),
    linhaFatura: z.array(
        z.object({
            idPalete: z.number(),
            idArtigo: z.number(),
            quantidade: z.number(),
            diasFaturar: z.number(),
            subtotal: z.number(),
        }),
    ),
    total: z.number(),
});

export default function AdicionarFatura({ clientes }: Props) {
    const [paletes, setPaletes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idCliente: '',
            dataI: '',
            dataF: '',
            linhaFatura: [{ idPalete: 0, idArtigo: 0, quantidade: 0, diasFaturar: 0, subtotal: 0 }],
            total: 0,
        },
    });

    const dataI = form.watch('dataI');
    const dataF = form.watch('dataF');
    const idCliente = form.watch('idCliente');

    useEffect(() => {
        let route: string = '';

        route = `/gestao-faturas/buscar-paletes-por-faturar/${idCliente}/${dataI}/${dataF}`;

        axios
            .get(route)
            .then((res) => {
                setPaletes(res.data.paletes);
                setIsLoading(false);
                console.log(res.data.paletes);

                form.setValue(
                    'linhaFatura',
                    res.data.paletes.map((palete: any) => ({
                        idPalete: palete.idPalete,
                        idArtigo: palete.idArtigo,
                        quantidade: palete.quantidade,
                        diasFaturar: palete.diasFaturar,
                        subtotal: palete.subtotal,
                    })),
                );

                const total = res.data.paletes.reduce((total, palete) => total + Number(palete.subtotal), 0);
                form.setValue('total', total);
            })
            .catch((err) => {
                console.error(err);
                setPaletes([]);
            });
    }, [idCliente, dataI, dataF]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/adicionar-fatura', values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Faturas | Adicionar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-150 p-4">
                    <FormField
                        control={form.control}
                        name="idCliente"
                        render={({ field }) => (
                            <FormItem className="pb-6">
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full rounded-md border p-2"
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    >
                                        <option>Selecione um cliente...</option>
                                        {clientes.map((cliente) => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nome}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-15">
                        <div>
                            <FormLabel>Data de Início</FormLabel>
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="dataI"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel>Data</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="w-37" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <FormLabel>Data de Conclusão</FormLabel>
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="dataF"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel>Data</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="w-37" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        {isLoading == true ? (
                            <p className="text-center font-bold">Loading...</p>
                        ) : (
                            <>
                                <p className="font-bold">Paletes a faturar</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">ID da Palete</TableHead>
                                            <TableHead className="text-center">Artigo</TableHead>
                                            <TableHead className="text-center">Quantidade</TableHead>
                                            <TableHead className="text-center">Dias no armazém</TableHead>
                                            <TableHead className="text-center">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {form.watch('linhaFatura').map((linha, index) => (
                                            <TableRow key={index} className="text-center">
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`linhaFatura.${index}.idPalete`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <span>{linha.idPalete}</span>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`linhaFatura.${index}.idArtigo`}
                                                        render={({ field }) => {
                                                            const artigo = paletes.find((palete) => palete.idArtigo === field.value);
                                                            return (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <span>{artigo?.nomeArtigo ?? 'Artigo desconhecido'}</span>
                                                                    </FormControl>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`linhaFatura.${index}.quantidade`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <span>{linha.quantidade}</span>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`linhaFatura.${index}.diasFaturar`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <span>{linha.diasFaturar}</span>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`linhaFatura.${index}.subtotal`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <span>{linha.subtotal}</span>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        <TableRow>
                                            <TableCell />
                                            <TableCell />
                                            <TableCell />
                                            <TableCell className="text-right font-bold">Total:</TableCell>
                                            <TableCell className="text-center">
                                                <FormField
                                                    control={form.control}
                                                    name="total"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <span>
                                                                    {form.watch('total')} €
                                                                </span>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </>
                        )}
                    </div>
                    <Button type="submit" className="hover:bg-green-500">
                        Adicionar
                    </Button>
                </form>
            </Form>
        </AppLayout>
    );
}
