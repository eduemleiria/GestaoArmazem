import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Cliente } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Clientes | Editar',
        href: '/editar-cliente',
    },
];

export default function EditarCliente({ cliente }: { cliente: Cliente }) {
    const [isChecked, setIsChecked] = useState(cliente?.password ? true : false);

    let changeValidation = isChecked ? z.string().min(4, 'A password tem de ter no mínimo 4 caracteres!').max(16) : z.string().optional();

    const formSchema = z.object({
        nome: z.string().min(1, 'O nome deve ter pelo menos 1 caracter').max(50),
        morada: z.string().min(1, 'Email inválido').max(190),
        password: changeValidation,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: cliente?.nome || '',
            morada: cliente?.morada || '',
            password: '',
        },
    });

    function handleCheck() {
        setIsChecked(!isChecked);
    }

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
                    <div className="flex">
                        <FormLabel>Acesso há API:</FormLabel>
                        <input type="checkbox" className="check-red ml-2" checked={isChecked ? true : false} onChange={handleCheck} />
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

                    <Button type="submit">Guardar</Button>
                </form>
            </Form>
        </AppLayout>
    );
}
