import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Cliente, Artigo } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Artigos | Editar',
        href: '/editar-artigo',
    },
];

const formSchema = z.object({
    nome: z.string().min(1, 'Insira um nome válido!').max(150),
    idCliente: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
        message: 'Selecione um cliente válido!',
    }),
});

export default function EditarArtigo({ artigo }: { artigo: Artigo} ) {
    const { clientes } = usePage<{ clientes: Cliente[] }>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: artigo?.nome || '',
            idCliente: artigo?.idCliente || '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.patch(route('editar-artigo.update', artigo.id), values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Artigos | Editar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
                    <FormField
                        control={form.control}
                        name="idCliente"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full rounded-md border p-2">
                                        <option value="">Selecione um cliente...</option>
                                        {clientes?.map((cliente) => (
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
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Novo nome..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Guardar</Button>
                </form>
            </Form>
        </AppLayout>
    );
}
