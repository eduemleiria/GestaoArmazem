import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { HandshakeIcon, LucideTruck, Package, PackageMinus, PackagePlus, TrendingUpIcon, TruckIcon } from 'lucide-react';
import { any } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface PageProps {
    clientes: number;
}

export default function Dashboard() {
    const { clientes } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex items-center justify-center">
                <div className="w-100 p-4">
                    <Card className="@container/card items-center">
                        <PackagePlus className="size-11" />
                        <CardHeader className="items-center justify-center">
                            <CardDescription>Documentos de Entrada | Hoje</CardDescription>
                            <CardTitle className="text-2xl font-semibold">6</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div className="w-100 p-4">
                <Card className="@container/card items-center">
                        <PackageMinus className="size-11" />
                        <CardHeader className="items-center justify-center">
                            <CardDescription>Documentos de Saída | Hoje</CardDescription>
                            <CardTitle className="text-2xl font-semibold">2</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div className="w-100 p-4">
                    <Card className="@container/card">
                        <CardHeader className="relative">
                            <CardDescription>Paletes no armazém</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">439</CardTitle>
                            <div className="absolute top-4 right-4">
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                    <TrendingUpIcon className="size-3" />
                                    +12.5%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Trending up this month <TrendingUpIcon className="size-4" />
                            </div>
                            <div className="text-muted-foreground">Visitors for the last 6 months</div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div>
                <h1>tabela com documentos de entrada saida de hoje aqui com opções de filtrar por doc de entrada ou saida</h1>
            </div>
        </AppLayout>
    );
}
