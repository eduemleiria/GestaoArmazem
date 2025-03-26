import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Cliente, columns } from './columns';
import { DataTable } from './data-table';

interface PageProps {
    users: Cliente[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão dos Users | Listagem',
        href: 'gestao-users/listar',
    },
];

export default function GestaoUsers() {
    const { users } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Users | Lista" />
            <div className="p-2">
                <Button asChild className="bg-green-400 hover:bg-green-500 hover:text-black">
                    <Link href="/gestao-users/adicionar">Adicionar user</Link>
                </Button>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-1">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable columns={columns} data={users} />
                </div>
            </div>
        </AppLayout>
    );
}
