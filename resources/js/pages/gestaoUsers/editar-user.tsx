import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Role } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão dos Users | Editar',
        href: '/editar-user',
    },
];

const formSchema = z.object({
    nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(50),
    email: z.string().email('Email inválido'),
    idRole: z.string(),
});

export default function EditarUser({ user }: any) {
    const { roles } = usePage<{ roles: Role[] }>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: user?.name || '',
            email: user?.email || '',
            idRole: user?.idRole?.[0]?.toString() || '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.patch(route('editar-user.update', user.id), values, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Users | Editar" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="idRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    >
                                        <option value="">Selecione uma role...</option>
                                        {roles?.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
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
