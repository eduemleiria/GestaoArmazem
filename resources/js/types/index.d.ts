import { StringOrTemplateHeader } from '@tanstack/react-table';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Documento = {
    id: string;
    estado: string;
    tipoDoc: string;
    data: string;
    hora: string;
    moradaC: string;
    moradaD: string;
    matricula: string;
    idCliente: string;
};

export type LinhaDocumento = {
    id: string;
    idArtigo: string;
    quantidade: number;
    localizacao: string;
};

export type Role = {
    id: string;
    name: string;
};

export type Cliente = {
    id: string;
    nome: string;
};

export type Artigo = {
    id: string;
    nome: string;
    localizacao?: string;
};

export type Palete = {
    id: string;
    idArtigo: string;
    quantidade: string;
    localizacao: string;
    dataEntrada: string;
    dataSaida: string;
    idLinhasDE: string;
}
