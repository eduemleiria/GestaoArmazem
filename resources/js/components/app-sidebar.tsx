import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { AppWindowIcon, BookOpen, BriefcaseBusiness, FileIcon, FilesIcon, Folder, HandCoinsIcon, Handshake, HandshakeIcon, LayoutGrid, LucideHeartHandshake, Package, PackagePlus, User2, User2Icon } from 'lucide-react';
import AppLogo from './app-logo';

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
        title: 'Home Page',
        href: '/',
        icon: AppWindowIcon,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
