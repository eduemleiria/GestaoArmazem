import SaveDocumentoDialog from '@/components/save-documento-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Artigo, Cliente, Documento, LinhaDocumento, Role, type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Documentos | Editar',
        href: '/editar-documento',
    },
];

const formSchema = z.object({
    tipoDoc: z.string(),
    idCliente: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
        message: 'Selecione um cliente válido!',
    }),
    linhaDocumento: z.array(
        z.object({
            id: z.number(),
            idArtigo: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
                message: 'Selecione um artigo válido!',
            }),
            quantidade: z.string().min(1, 'A quantidade deve ser pelo menos 1!'),
            localizacao: z.string(),
        }),
    ),
    dataP: z.string(),
    horaP: z.string(),
});

type Props = {
    documento: Documento;
    linhasDocumento: LinhaDocumento[];
};

export default function EditarDocumento({ documento, linhasDocumento }: Props) {
    const { userLogadoRole }: any = usePage<{ userLogadoRole: Role[] }>().props;
    const { clientes }: any = usePage<{ clientes: Cliente[] }>().props;
    const [artigos, setArtigos] = useState<Artigo[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipoDoc: documento?.tipoDoc || '',
            idCliente: documento?.idCliente || '',
            linhaDocumento: linhasDocumento.map((linha: any) => ({
                id: linha.id || '',
                idArtigo: linha.idArtigo || '',
                quantidade: linha.quantidade?.toString() || '0',
                localizacao: linha.localizacao?.toString() || '',
            })),
            dataP: documento?.data || '',
            horaP: documento?.hora || '',
        },
    });

    const getTipoDoc = (tipoDoc: string): any => {
        switch (tipoDoc) {
            case 'Documento de Entrada':
                return { doc: 'Chegada' };
            case 'Documento de Saída':
                return { doc: 'Saída' };
            default:
                return { doc: '' };
        }
    };
    const tipoDocAgr = getTipoDoc(documento?.tipoDoc);

    const [showText, setShowText] = useState(tipoDocAgr.doc);

    const handletext = (e: any) => {
        const getvalue = e.target.value;
        if (getvalue == 'Documento de Entrada') {
            const show = 'Chegada';
            setShowText(show);
        } else if (getvalue == 'Documento de Saída') {
            const show = 'Saída';
            setShowText(show);
        }
    };

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'linhaDocumento',
    });

    const idCliente = form.watch('idCliente');

    useEffect(() => {
        if (idCliente) {
            axios
                .get(`/gestao-documentos/busca-artigos/${idCliente}`)
                .then((response) => setArtigos(response.data))
                .catch((error) => console.error(error));
        } else {
            setArtigos([]);
        }
    }, [idCliente]);

    const getUserLogadoRole = (role: string): any => {
        switch (role) {
            case 'gerente':
                return {
                    cor: 'bg-gray-100',
                    editable: 'true',
                    buttonSave: <SaveDocumentoDialog documentoId={documento.id} values={form.getValues()} />,
                };
            default:
                return {
                    cor: '',
                    editable: '',
                    buttonSave: (
                        <Button type="submit" className="flex w-46 hover:bg-green-500">
                            Guardar
                        </Button>
                    ),
                };
        }
    };

    const userRole = getUserLogadoRole(userLogadoRole);

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.patch(route('editar-documento.update', documento.id), values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Documentos | Editar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-200 gap-4 p-4">
                    <FormField
                        control={form.control}
                        name="tipoDoc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Documento</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className={`w-full rounded-md border p-2 ${userRole.cor}`}
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handletext(e);
                                        }}
                                        disabled={userRole.editable}
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
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <select {...field} className={`w-full rounded-md border p-2 ${userRole.cor}`} disabled={userRole.editable}>
                                        <option value="">Selecione um cliente...</option>
                                        {clientes?.map((cliente: any) => (
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
                    <p className="font-bold">Paletes a entrar</p>
                    {fields.map((field: any, index: any) => {
                        return (
                            <div key={field.id} className="grid-col-3 mb-3 grid grid-flow-col gap-3">
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name={`linhaDocumento.${index}.idArtigo`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Artigo</FormLabel>
                                                <FormControl>
                                                    <select {...field} className={`w-full rounded-md border p-2`}>
                                                        <option value="">Selecione um artigo...</option>
                                                        {artigos.map((artigo) => (
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
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name={`linhaDocumento.${index}.localizacao`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Localização</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...form.register(`linhaDocumento.${index}.localizacao`)}
                                                        type="text"
                                                        disabled={!userRole.editable}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1 mt-6 ml-2">
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
                        className="w-46 hover:bg-green-500"
                        onClick={() => {
                            append({ id: 0, idArtigo: '', quantidade: '', localizacao: '' });
                        }}
                    >
                        Adicionar linha
                    </Button>
                    <div className="gap-4 py-3">
                        <p>
                            Data e hora de <b>{showText}</b> prevista
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
                                            <Input type="time" className="w-23" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    {userRole.buttonSave}
                </form>
            </Form>
        </AppLayout>
    );
}
