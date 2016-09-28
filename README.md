
Busca informações no Cadastro Nacional de Pessoas Jurídicas junto à Receita Federal do Brasil.

# Requisitos

* node.js v6.x
* npm v3.x

# Como usar

```
node index session=id < input.txt
```

`session=id` deve ser obtido através do site http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/cnpjreva_solicitacao2.asp, após validação do captcha.
`input.txt` é um arquivo texto contendo um CNPJ por linha. Pode ser omitido, neste caso será lido do terminal.

As informações das empresas estarão no arquivo `./data/db.json`.

# Projeto

* [ ] Recuperar a informação do CNPJ
    * [X] Salvar retorno em arquivo
    * [ ] Extrair logradouro, numero, cep, municipio, uf
* [ ] Recuperar a informação do QSA
    * [X] Salvar retorno em arquivo
    * [X] Extrair nome e qualificacao
    * [ ] Quando filial, buscar dados da matriz
* [X] Recuperar CNPJs em lote

# Licença

MIT
