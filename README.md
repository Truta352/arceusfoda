# Site Arceus

Site institucional da Arceus: montagem de computadores, câmeras (CFTV), cabeamento de rede e racks.

## Estrutura

```
arceus-site/
├── index.html        → conteúdo da página
├── css/style.css     → visual (cores nas variáveis do topo, em :root)
├── js/main.js        → menu do celular, animações, formulário
└── img/              → logo, símbolo e favicon
```

## Para abrir

Basta abrir o `index.html` no navegador. Não precisa de servidor nem de instalar nada.

## Para trocar os contatos

1. Em `js/main.js`, altere o objeto `CONFIG` (WhatsApp só com dígitos: 55 + DDD + número).
2. Em `index.html`, altere o texto que aparece na seção Contato (e-mail e telefone).

## Como o formulário funciona

O site não tem servidor, então o formulário valida os campos e abre a mensagem já
escrita no WhatsApp ou no aplicativo de e-mail da pessoa, de acordo com a opção escolhida.

## Publicar no GitHub Pages

1. Crie um repositório e envie todos os arquivos desta pasta (com o `index.html` na raiz).
2. No repositório: Settings → Pages → Source: branch `main`, pasta `/ (root)`.
3. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
