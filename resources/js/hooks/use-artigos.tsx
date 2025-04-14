import { useEffect, useState } from 'react';
import axios from 'axios';

export function useArtigos(tipoDoc: string, idCliente: string) {
    const [artigos, setArtigos] = useState([]);

    useEffect(() => {
        if (!idCliente || !tipoDoc) {
            setArtigos([]);
            return;
        }

        const route =
            tipoDoc === 'Documento de Saída'
                ? `/gestao-documentos/busca-artigos-com-paletes/${idCliente}`
                : `/gestao-documentos/busca-artigos/${idCliente}`;

        axios
            .get(route)
            .then((res) => setArtigos(res.data))
            .catch((err) => {
                console.error(err);
                setArtigos([]);
            });
    }, [tipoDoc, idCliente]);

    return artigos;
}
