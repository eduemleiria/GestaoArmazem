import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Clientes | Adicionar',
        href: '/adicionar-cliente',
    },
];

export default function AdicionarCliente() {
    const [isChecked, setIsChecked] = useState(false);

    let changeValidation = isChecked ? z.string().min(4, 'A password tem de ter no mínimo 4 caracteres!').max(16) : z.string().optional();

    const formSchema = z.object({
        nome: z.string().min(1, 'O nome deve ter pelo menos 1 caracter').max(150),
        morada: z.string().min(1, 'A morada é demasiado pequena').max(190),
        password: changeValidation,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: '',
            morada: '',
            password: '',
        },
    });

    function handleCheck() {
        setIsChecked(!isChecked);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/adicionar-cliente', values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Clientes | Adicionar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-150 space-y-8 p-4">
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
                    <div className="flex">
                        <FormLabel>Acesso há API: </FormLabel>
                        <input type="checkbox" className="ml-2 border-black" checked={isChecked} onChange={handleCheck} />
                    </div>
                    {isChecked ? (
                        <div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Password exemplo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ) : (
                        ''
                    )}

                    <Button type="submit" className="hover:bg-green-500">
                        Adicionar
                    </Button>
                </form>
            </Form>
        </AppLayout>
    );
}
