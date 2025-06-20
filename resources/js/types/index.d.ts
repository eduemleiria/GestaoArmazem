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

export interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface PaginationProps {
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
    onPageChange: (url: string | null) => void;
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
    idRole: number[];
}

export type Documento = {
    id: number;
    estado: string;
    tipoDoc: string;
    data: string;
    hora: string;
    dataEmissao: string;
    moradaC: string;
    moradaD: string;
    matricula: string;
    idCliente: string;
};

export type LinhaDocumento = {
    id: number;
    idArtigo: string | number;
    quantidade: number;
    localizacao: string;
    confirmado: string;
};

export type Role = {
    id: string;
    name: string;
};

export type Cliente = {
    id: number;
    nome: string;
    morada: string;
    password: string;
};

export type Artigo = {
    id: number;
    nome: string;
    localizacao?: string;
    idCliente: string;
};

export type Palete = {
    id: number;
    idArtigo: string;
    quantidade: string;
    localizacao: string;
    dataEntrada: string;
    dataSaida: string;
    idLinhasDE: string;
}

export type Fatura = {
    id: number;
    total: string;
    dataEmissao: string;
    dataInicio: string;
    dataFim: string;
    idCliente: string;
    nomeCliente: string;
}

export type LinhaFatura = {
    id: number;
    idPalete: number;
    nomeArtigo: string;
    dataEntrada: string;
    quantidade: number;
    dias: number;
    subtotal: string;
};
