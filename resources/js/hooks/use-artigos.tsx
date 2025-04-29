import { useEffect, useState } from 'react';
import axios from 'axios';

export function useArtigos(tipoDoc: string, idCliente: string) {
    const [artigos, setArtigos] = useState([]);

    useEffect(() => {
        if (!idCliente || !tipoDoc) {
            setArtigos([]);
            return;
        }

        let route: string = '';

        if(tipoDoc == "Documento de Saída"){
            route = `/gestao-documentos/busca-artigos-com-paletes/${idCliente}`;
        }else{
            route = `/gestao-documentos/busca-artigos/${idCliente}`;
        }

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
