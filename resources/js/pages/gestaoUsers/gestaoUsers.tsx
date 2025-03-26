import { useEffect, useState } from "react";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com"
      },
    ];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão dos Users',
        href: '/gestao-users',
    },
];

export default function GestaoClientes() {
    const [data, setData] = useState<Payment[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getData();
            setData(result);
        }
        fetchData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </AppLayout>
    );
}
