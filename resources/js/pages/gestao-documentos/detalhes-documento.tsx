import AppLayout from '@/layouts/app-layout';
import { Documento, LinhaDocumento, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckIcon, Clock10Icon, Loader, PenBox } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestão de Documentos | Detalhes',
        href: '/detalhes-doc',
    },
];

type Props = {
    documento: Documento;
    linhasDocumento: LinhaDocumento[];
};

export default function DetalhesDoc({ documento, linhasDocumento }: Props) {
    const getEstadoInfo = (estado: string) => {
        switch (estado) {
            case 'Pendente':
                return { cor: 'bg-yellow-300', icon: <Clock10Icon className="w-5 pr-1" /> };
            case 'Concluído':
                return { cor: 'bg-lime-400', icon: <CheckIcon className="w-5 pr-1" /> };
            default:
                return { cor: 'bg-gray-300', icon: <PenBox className="w-5 pr-1" /> };
        }
    };

    const estadoInfo = getEstadoInfo(documento.estado);

    const getTipoDoc = (tipoDoc: string) => {
        switch (tipoDoc) {
            case 'Documento de Entrada':
                return { tipo: 'entrar', tipoData: 'Chegada', camposGuiaT: '' };
            case 'Documento de Saída':
                return {
                    tipo: 'sair',
                    tipoData: 'Saida',
                    camposGuiaT: (
                        <>
                            <div className="flex">
                                <h3 className="font-medium">Morada do cliente:</h3>
                                <h3 className="pl-2">{documento.moradaC}</h3>
                            </div>
                            <div className="flex">
                                <h3 className="font-medium">Morada do destinatário:</h3>
                                <h3 className="pl-2">{documento.moradaD}</h3>
                            </div>
                            <div className="flex">
                                <h3 className="font-medium">Matrícula:</h3>
                                <h3 className="pl-2">{documento.matricula}</h3>
                            </div>
                        </>
                    ),
                };
            default:
                return { tipo: '(Tipo de documento não econtrado)', tipoData: '(Tipo de documento não econtrado)', camposGuiaT: '' };
        }
    };

    const tipoDocInfo = getTipoDoc(documento.tipoDoc);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Documentos | Detalhes" />
            <div className="p-4">
                <h1 className="pb-4 text-xl font-bold">Documento #{documento.id}</h1>
                <div className="grid gap-y-3">
                    <div className="flex">
                        <h3 className="font-medium">Tipo de Documento:</h3>
                        <h3 className="pl-2">{documento.tipoDoc}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="font-medium">ID:</h3>
                        <h3 className="pl-2">{documento.id}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="font-medium">Data de {tipoDocInfo.tipoData} Prevista:</h3>
                        <h3 className="pl-2">{documento.data}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="font-medium">Data de Emissão:</h3>
                        <h3 className="pl-2">{documento.dataEmissao}</h3>
                    </div>
                    <div className="flex">
                        <h3 className="pr-2 font-medium">Estado do documento:</h3>
                        <h3 className={`flex rounded px-2 font-semibold ${estadoInfo.cor}`}>
                            {estadoInfo.icon}
                            {documento.estado}
                        </h3>
                    </div>
                    {tipoDocInfo.camposGuiaT}
                    <h3 className="font-medium">Paletes a {tipoDocInfo.tipo}:</h3>
                    <div className="rounded-md border-2">
                        <table className="w-full">
                            <tr className="border">
                                <th>Artigo</th>
                                <th>Quantidade</th>
                                <th>Localização</th>
                            </tr>
                            {linhasDocumento.map((linha: LinhaDocumento) => (
                                <tr key={linha.id} className="border text-center">
                                    <td>{linha.idArtigo}</td>
                                    <td>{linha.quantidade}</td>
                                    <td>{linha.localizacao}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
