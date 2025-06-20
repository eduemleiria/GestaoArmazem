import SaveDocumentoDialog from '@/components/save-documento-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Artigo, Cliente, Documento, LinhaDocumento, type BreadcrumbItem } from '@/types';
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

// Validações do formulário com o zod
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
            quantidade: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
                message: 'Selecione um artigo válido!',
            }),
            localizacao: z.string(),
            confirmado: z.string(),
        }),
    ),
    moradaC: z.string(),
    moradaD: z.string(),
    matricula: z.string(),
    dataP: z.string(),
    horaP: z.string(),
});

type Props = {
    documento: Documento;
    linhasDocumento: LinhaDocumento[];
};

export default function EditarDocumento({ documento, linhasDocumento }: Props) {
    // Isto inicializa a informação recebida do backend
    const { userLogadoRole } = usePage<{ userLogadoRole: string }>().props;
    const { clientes } = usePage<{ clientes: Cliente[] }>().props;
    const [artigos, setArtigos] = useState<Artigo[]>([]);

    // Isto cria a estrutura do formulário com os correspondentes valores
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipoDoc: documento?.tipoDoc || '',
            idCliente: documento?.idCliente || '',
            linhaDocumento: linhasDocumento.map((linha: LinhaDocumento) => ({
                id: linha.id || 0,
                idArtigo: linha.idArtigo || '',
                quantidade: linha.quantidade || 0,
                localizacao: linha.localizacao?.toString() || '',
                confirmado: linha.confirmado?.toString() || 'Confirmar',
            })),
            moradaC: documento?.moradaC || '',
            moradaD: documento?.moradaD || '',
            matricula: documento?.matricula || '',
            dataP: documento?.data || '',
            horaP: documento?.hora || '',
        },
    });

    // Recebe o tipo de documento e muda consoante o seu valor (focado em estética)
    const getTipoDocTexto = (tipoDoc: string) => {
        switch (tipoDoc) {
            case 'Documento de Entrada':
                return { data: 'Chegada', camposGuiaT: '' };
            case 'Documento de Saída':
                return {
                    data: 'Saída',
                    camposGuiaT: (
                        <>
                            <FormField
                                control={form.control}
                                name="moradaC"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Morada do Cliente</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="moradaD"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Morada do destinatário</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="matricula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Matrícula</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    ),
                };
            default:
                return { data: '(Selecione um tipo de documento)', camposGuiaT: '' };
        }
    };

    const [showText, setShowText] = useState(getTipoDocTexto(documento?.tipoDoc));

    const handletext = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setShowText(getTipoDocTexto(e.target.value));
    };

    // Isto inicializa os campos dinamicos com o react-hook-form lingado-os ao form.control linhaDocumento
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'linhaDocumento',
    });

    // Isto fica de vigia se o cliente foi trocado e vai buscar os artigos desse cliente
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

    // Lógica de adicionar linha consuante o resto e a quantidade original
    const [confirmado, setConfirmado] = useState<Record<number, string>>({});
    const [quantidadeOriginal, setQuantidadeOriginal] = useState<Record<number, number>>({});
    const [idLinha, setIdLinha] = useState<number[]>([]);

    useEffect(() => {
        const values = form.getValues();
        const originais: Record<number, number> = {};

        values.linhaDocumento?.forEach((item: LinhaDocumento, idx: number) => {
            if (item?.quantidade != null) {
                originais[idx] = item.quantidade;
            }
        });
        setQuantidadeOriginal(originais);
    }, []);

    function proximoId() {
        const allIds = form.getValues().linhaDocumento.map((linha: LinhaDocumento) => linha.id);
        const maxId = Math.max(...allIds, ...idLinha);
        return maxId + 1;
    }

    const confirmaHandler = (index: number) => {
        const values = form.getValues();
        const linha = values.linhaDocumento[index];
        const original = quantidadeOriginal[index];
        const linhaConfirmada = linha.quantidade;
        const resto = original - linhaConfirmada;

        setIdLinha((prev) => {
            if (!prev.includes(linha.id)) {
                return [...prev, linha.id];
            }
            return prev;
        });

        setConfirmado((prev) => ({
            ...prev,
            [index]: prev[index] === 'Confirmado' ? 'Confirmar' : 'Confirmado',
        }));

        form.setValue(`linhaDocumento.${index}.confirmado`, 'Confirmado');

        if (!confirmado[index] && resto > 0) {
            const newId = proximoId();

            append({
                id: newId,
                idArtigo: linha.idArtigo,
                quantidade: resto,
                localizacao: '',
                confirmado: '',
            });

            setQuantidadeOriginal((prev) => ({
                ...prev,
                [fields.length]: resto,
            }));
        }
    };

    // Desativa os campos se o botão estiver como "confirmado"
    const desativado = (index: number) => confirmado[index] === 'Confirmado';

    const getUserLogadoRole = (role: string) => {
        switch (role) {
            case 'gerente':
                return {
                    cor: 'bg-gray-100',
                    editable: true,
                    buttonSave: <SaveDocumentoDialog documentoId={documento.id} getValues={form.getValues} />,
                    btnExtraLinha: (index: number) => (
                        <div>
                            <Button
                                id={`confirmar-${index}`}
                                onClick={() => confirmaHandler(index)}
                                disabled={desativado(index)}
                                className={`hover:bg-green-500`}
                            >
                                {confirmado[index] || 'Confirmar'}
                            </Button>
                        </div>
                    ),
                    btnResetEdit: (
                        <Button type="button" onClick={() => window.location.reload()} className="flex w-25 bg-red-400 hover:bg-red-600 hover:font-bold">
                            Resetar
                        </Button>
                    ),
                    btnAddLinha: '',
                };
            default:
                return {
                    cor: '',
                    editable: false,
                    buttonSave: (
                        <Button type="submit" className="flex w-46 hover:bg-green-500">
                            Guardar
                        </Button>
                    ),
                    btnExtraLinha: (index: number) => (
                        <Button
                            onClick={() => {
                                remove(index);
                            }}
                            className="bg-red-400 text-black hover:bg-red-500 hover:text-white"
                        >
                            Remover linha
                        </Button>
                    ),
                    btnResetEdit: '',
                    btnAddLinha: (
                        <Button
                            className="w-46 hover:bg-green-500"
                            onClick={() => {
                                append({ id: 0, idArtigo: '', quantidade: 0, localizacao: '', confirmado: '' });
                            }}
                        >
                            Adicionar linha
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
                                        {clientes?.map((cliente: Cliente) => (
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
                    {showText.camposGuiaT}
                    <div className="flex justify-between">
                        <p className="font-bold">Paletes a entrar</p>
                        {userRole.btnResetEdit}
                    </div>
                    {fields.map((field, index: number) => (
                        <div key={field.id || index} className="grid-col-3 mb-3 grid grid-flow-col gap-3">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name={`linhaDocumento.${index}.idArtigo`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Artigo</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className={`w-full rounded-md border p-2 ${userRole.cor}`}
                                                    disabled={userRole.editable}
                                                >
                                                    <option>Selecione um artigo...</option>
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
                                                <Input
                                                    {...field}
                                                    disabled={desativado(index)}
                                                    type="number"
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                />
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
                                                <Input {...field} type="text" disabled={desativado(index) || !userRole.editable} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-1 mt-6 ml-2">{userRole.btnExtraLinha(index)}</div>
                        </div>
                    ))}
                    <div className="">{userRole.btnAddLinha}</div>

                    <div className="gap-4 py-3">
                        <p>
                            Data e hora de <b>{showText.data}</b> prevista
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
