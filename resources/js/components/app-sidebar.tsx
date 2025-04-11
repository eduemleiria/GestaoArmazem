import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { AppWindowIcon, Boxes, FilesIcon, HandshakeIcon, LayoutGrid, Package, User2Icon } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Gestão de Users',
        href: '/gestao-users/listar',
        icon: User2Icon,
        roles: ['admin'],
    },
    {
        title: 'Gestão de Clientes',
        href: '/gestao-clientes/listar',
        icon: HandshakeIcon,
    },
    {
        title: 'Gestão de Artigos',
        href: '/gestao-artigos/listar',
        icon: Package,
    },
    {
        title: 'Gestão de Documentos',
        href: '/gestao-documentos/listar',
        icon: FilesIcon,
    },
    {
        title: 'Gestão de Paletes',
        href: '/gestao-paletes/listar',
        icon: Boxes,
    },
    {
        title: 'Home Page',
        href: '/',
        icon: AppWindowIcon,
    },
];

export function AppSidebar() {
    const { roles } = usePage().props.auth as {
        roles: string[];
    };

    const filtrarItems = mainNavItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.some(role => roles.includes(role));
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filtrarItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
