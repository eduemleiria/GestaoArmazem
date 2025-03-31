import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUpIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex items-center">
                <div className="w-100 p-4">
                    <Card className="@container/card">
                        <CardHeader className="relative">
                            <CardDescription>Clientes totais</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">23</CardTitle>
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
                <div className="w-100 p-4">
                    <Card className="@container/card">
                        <CardHeader className="relative">
                            <CardDescription>Receita do mês</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
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
                <div className="w-100 p-4">
                    <Card className="@container/card">
                        <CardHeader className="relative">
                            <CardDescription>Paletes no armazém</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">127/250</CardTitle>
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
        </AppLayout>
    );
}
