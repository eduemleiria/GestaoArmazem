import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useArtigos } from '@/hooks/use-artigos';
import AppLayout from '@/layouts/app-layout';
import { Artigo, Cliente, Documento, LinhaDocumento, type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Documentos | Adicionar',
        href: '/adicionar-doc',
    },
];

// Desta linha há 39, é os types e regras do formulários
type Props = {
    documento: Documento;
    linhasDocumento: LinhaDocumento[];
    cliente: Cliente;
    artigo: Artigo;
};

const formSchema = z.object({
    tipoDoc: z.string({ required_error: 'É necessário inserir uma opção!' }),
    idCliente: z.string({ required_error: 'É necessário inserir uma opção!' }),
    linhaDocumento: z.array(
        z.object({
            idArtigo: z.string({ required_error: 'Selecione um artigo!' }),
            quantidade: z.string().min(1, 'A quantidade deve ser pelo menos 1!'),
        }),
    ),
    dataP: z.string().optional(),
    horaP: z.string().optional(),
});

export default function AdicionarDocumento() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idCliente: '',
            tipoDoc: '',
            linhaDocumento: [{ idArtigo: '', quantidade: '' }],
            dataP: '',
            horaP: '',
        },
    });

    // Isto é o que permite adicionar mais linhas de documento
    const { fields, append, remove } = useFieldArray({
        name: 'linhaDocumento',
        control: form.control,
    });

    const { clientes } = usePage<{ clientes: Cliente[] }>().props;

    // Isto permite filtrar os artigos consuante o tipo de documento e o cliente escolhidos
    const tipoDoc = form.watch('tipoDoc');
    const idCliente = form.watch('idCliente');
    const artigos = useArtigos(tipoDoc, idCliente);

    const getTipoDoc = (tipoDoc: string): any => {
        switch (tipoDoc) {
            case 'Documento de Entrada':
                return { doc: 'Entrar', data: 'Chegada' };
            case 'Documento de Saída':
                return { doc: 'Saír', data: 'Saída' };
            default:
                return { doc: '(Escolha um tipo de documento)', data: '(Escolha um tipo de documento)' };
        }
    };
    const tipoDocAgr = getTipoDoc(tipoDoc);

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/adicionar-doc', values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Documentos | Adicionar" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-150 p-4">
                    <FormField
                        control={form.control}
                        name="tipoDoc"
                        render={({ field }) => (
                            <FormItem className="pb-4">
                                <FormLabel>Tipo de Documento</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full rounded-md border p-2"
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    >
                                        <option>Selecione um tipo de documento...</option>
                                        <option value="Documento de Entrada">Documento de Entrada</option>
                                        <option value="Documento de Saída">Documento de Saída</option>
                                        <option value="Guia de Transporte">Guia de Transporte</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="idCliente"
                        render={({ field }) => (
                            <FormItem className="pb-6">
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full rounded-md border p-2">
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
                    <div>
                        <p className="pb-3 font-bold">Paletes a {tipoDocAgr.doc}</p>
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="grid-col-4 mb-3 grid grid-flow-col gap-3">
                                    <div className="col-span-2 w-75">
                                        <FormField
                                            control={form.control}
                                            name={`linhaDocumento.${index}.idArtigo`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Artigo</FormLabel>
                                                    <FormControl>
                                                        <select {...field} className="w-full rounded-md border p-2">
                                                            <option>Selecione um artigo...</option>
                                                            {artigos.map((artigo: Artigo) => (
                                                                <option key={artigo.id} value={artigo.id}>
                                                                    {artigo.nome}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name={`linhaDocumento.${index}.quantidade`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantidade</FormLabel>
                                                    <FormControl>
                                                        <Input {...form.register(`linhaDocumento.${index}.quantidade`)} type="number" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1 mt-6">
                                        <Button
                                            onClick={() => {
                                                remove(index);
                                            }}
                                            className="bg-red-400 text-black hover:bg-red-500 hover:text-white"
                                        >
                                            Remover linha
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                        <Button
                            className="mt-3 hover:bg-lime-300"
                            onClick={() => {
                                append({ idArtigo: '', quantidade: '' });
                            }}
                        >
                            Adicionar linha
                        </Button>
                        <div className="gap-4 py-6">
                            <p>
                                Data e hora de <b>{tipoDocAgr.data}</b> prevista
                            </p>
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="dataP"
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
                                <FormField
                                    control={form.control}
                                    name="horaP"
                                    render={({ field }) => (
                                        <FormItem className="mt-5">
                                            <FormLabel>Hora</FormLabel>
                                            <FormControl>
                                                <Input type="time" className="w-37" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="hover:bg-green-500">
                        Adicionar
                    </Button>
                </form>
            </Form>
        </AppLayout>
    );
}
