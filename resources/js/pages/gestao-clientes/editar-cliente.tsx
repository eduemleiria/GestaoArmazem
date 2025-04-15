import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Cliente } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Head } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Clientes | Editar',
        href: '/editar-cliente',
    },
];

const formSchema = z.object({
    nome: z.string().min(1, 'O nome deve ter pelo menos 1 caracter').max(50),
    morada: z.string().min(1, 'Email inválido').max(190),
});

export default function EditarCliente({ cliente }: { cliente: Cliente }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: cliente?.nome || '',
            morada: cliente?.morada || '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.patch(route('editar-cliente.update', cliente.id), values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Clientes | Editar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Novo nome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="morada"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Moraada</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nova morada" {...field} />
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
