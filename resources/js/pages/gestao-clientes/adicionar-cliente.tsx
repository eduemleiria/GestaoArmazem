import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Head } from '@inertiajs/react';
import { User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Clientes | Adicionar',
        href: '/adicionar-cliente',
    },
];

const formSchema = z.object({
    nome: z.string().min(1, 'O nome deve ter pelo menos 1 caracter').max(150),
    morada: z.string().min(1, 'A morada é demasiado pequena').max(190),
});

export default function AdicionarCliente() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: '',
            morada: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/adicionar-cliente', values, {
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Clientes | Adicionar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 w-150">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome exemplo" {...field} />
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
                                <FormLabel>Morada</FormLabel>
                                <FormControl>
                                    <Input placeholder="Morada exemplo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='hover:bg-green-500'>Adicionar</Button>
                </form>
            </Form>
        </AppLayout>
    );
}
