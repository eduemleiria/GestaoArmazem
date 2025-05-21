<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Guia de Transporte #{{ $infoDoc['id'] }}</title>
    <link rel="stylesheet" href="{{ public_path('css/guia-transporte.css') }}" type="text/css">
</head>

<body>
    <div class="documento">
        <header class="header">
            <h1>Guia de Transporte N.º{{ $infoDoc['id'] }}</h1>
        </header>

        <section class="info-doc">
            <div class="info">
                <p><strong>Tipo de documento:</strong> {{ $infoDoc['tipoDoc'] }}</p>
                <p><strong>Data de saída:</strong> {{ $infoDoc['data'] }}</p>
                <p><strong>Matrícula do veículo:</strong> {{ $infoDoc['matricula'] }}</p>
            </div>

            <div class="info">
                <p><strong>Nome do cliente:</strong> {{ $infoDoc['nomeCliente'] }}</p>
                <p><strong>Morada do cliente:</strong> {{ $infoDoc['moradaC'] }}</p>
                <p><strong>Morada do destinatário:</strong> {{ $infoDoc['moradaD'] }}</p>
            </div>
        </section>

        <section class="tabela">
            <h2>Detalhes da Carga</h2>
            <table class="tabela-paletes">
                <thead>
                    <tr>
                        <th>Nome do Artigo</th>
                        <th>Quantidade de Paletes</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($linhas as $linha)
                        <tr>
                            <td>{{ $linha['nomeArtigo'] }}</td>
                            <td>{{ $linha['quantidade'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </section>
</body>

</html>
