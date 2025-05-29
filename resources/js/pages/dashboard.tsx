import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Package, PackageMinus, PackagePlus, TrendingUpIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    numDocsEntHj: number;
    numDocsSaidaHj: number;
    paletesNoArmazem: number;
}

export default function Dashboard({ numDocsEntHj, numDocsSaidaHj, paletesNoArmazem }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex items-center justify-center">
                <div className="w-100 p-4">
                    <Card className="@container/card items-center">
                        <PackagePlus className="size-11" />
                        <CardHeader className="items-center justify-center">
                            <CardDescription>Documentos de Entrada | Hoje</CardDescription>
                            <CardTitle className="text-2xl font-semibold">{numDocsEntHj}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div className="w-100 p-4">
                    <Card className="@container/card items-center">
                        <PackageMinus className="size-11" />
                        <CardHeader className="items-center justify-center">
                            <CardDescription>Documentos de Saída | Hoje</CardDescription>
                            <CardTitle className="text-2xl font-semibold">{numDocsSaidaHj}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div className="w-100 p-4">
                    <Card className="@container/card items-center">
                        <Package className="size-11" />
                        <CardHeader className="items-center justify-center">
                            <CardDescription>Total de Paletes no Armazém</CardDescription>
                            <CardTitle className="text-2xl font-semibold">{paletesNoArmazem}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
