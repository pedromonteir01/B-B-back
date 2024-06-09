# B&B: Bom & Barato - BackEnd

Este é o repositório oficial do nosso aplicativo de delivery de comida B&B. Aqui você encontrará tudo o que precisa para desfrutar de uma experiência de pedido de comida rápida, fácil e segura. Explore uma variedade de restaurantes locais e faça seus pedidos com apenas alguns toques na tela do seu dispositivo móvel. Experimente uma nova maneira de saborear suas refeições favoritas, onde quer que esteja!

## Como Utilizar

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado globalmente (`npm install -g expo-cli`)

### Passos para Execução
1. Clone este repositório: `git clone url_do_seu_repositorio.git`
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `expo start`

## Estrutura de arquivos

O projeto segue uma organização lógica de arquivos, facilitando a manutenção e a compreensão do código:

```
react-native-expo-boilerplate/
├── src/
│   ├── components/
│   ├── data/
│   ├── routes/
│   ├── screens/
└── App.jsx
```

## Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)

## Documentação do Banco de Dados

### Tabelas:

1. **Usuários (`users`):**
   - `name`: Nome do usuário (varchar).
   - `email`: Email do usuário (varchar, chave primária).
   - `cpf`: CPF do usuário (char).
   - `telephone`: Telefone do usuário (char).
   - `password`: Senha do usuário (text).
   - `address`: ID do endereço do usuário (int).
   - **Chave Estrangeira:**
     - `address`: Referencia o ID de um endereço na tabela `address`.

2. **Restaurantes (`restaurants`):**
   - `id`: Identificador único do restaurante (serial).
   - `name`: Nome do restaurante (varchar).
   - `type`: Tipo de restaurante (varchar).
   - `operation`: Horário de operação do restaurante (char).
   - `address`: ID do endereço do restaurante (int).
   - **Chave Estrangeira:**
     - `address`: Referencia o ID de um endereço na tabela `address`.

3. **Endereço (`address`):**
   - `id`: Identificador único do endereço (serial).
   - `state`: Estado do endereço (char).
   - `city`: Cidade do endereço (varchar).
   - `street`: Nome da rua do endereço (varchar).
   - `neighborhood`: Bairro do endereço (varchar).
   - `number`: Número do endereço (int).
   - `complement`: Complemento do endereço (text).
   - `cep`: CEP do endereço (char).

4. **Pedidos (`orders`):**
   - `id`: Identificador único do pedido (serial).
   - `userEmail`: Email do usuário que fez o pedido (varchar).
   - `restaurantID`: ID do restaurante do pedido (int).
   - `dateandhour`: Data e hora do pedido (char).
   - `state`: Estado do pedido (varchar).
   - **Chaves Estrangeiras:**
     - `userEmail`: Referencia o email de um usuário na tabela `users`.
     - `restaurantID`: Referencia o ID de um restaurante na tabela `restaurants`.

5. **Itens do Pedido (`itensOrders`):**
   - `id`: Identificador único do item do pedido (serial).
   - `orderid`: ID do pedido (int).
   - `productid`: ID do produto (int).
   - `quantity`: Quantidade do produto no pedido (int).
   - **Chaves Estrangeiras:**
     - `orderid`: Referencia o ID de um pedido na tabela `orders`.
     - `productid`: Referencia o ID de um produto na tabela `products`.

6. **Produtos (`products`):**
   - `id`: Identificador único do produto (serial).
   - `name`: Nome do produto (varchar).
   - `description`: Descrição do produto (text).
   - `price`: Preço do produto (decimal).
   - `restaurantid`: ID do restaurante que vende o produto (int).
   - **Chave Estrangeira:**
     - `restaurantid`: Referencia o ID de um restaurante na tabela `restaurants`.
    
## Visão geral das rotas disponíveis

### Rotas

### 1. Home

- **Rota:** `/home`
- **Descrição:** Rota principal da aplicação, exibindo a página inicial com as opções disponíveis.

### 2. Pedidos

- **Rota:** `/orders`
- **Descrição:** Rota para visualização dos pedidos realizados pelo usuário.

### 3. Carrinho

- **Rota:** `/carrinho`
- **Descrição:** Rota para visualização e gerenciamento do carrinho de compras.

### 4. Equipe B&B

- **Rota:** `/sobre-nos`
- **Descrição:** Rota para exibir informações sobre a equipe responsável pelo projeto.

### 5. Perfil/Login

- **Rota:** `/login`
- **Descrição:** Rota para login de usuários. Se o usuário já estiver autenticado, exibirá o perfil do usuário.

### 6. Cadastro

- **Rota:** `/register`
- **Descrição:** Rota para registro de novos usuários.

### 7. Restaurantes

- **Rota:** `/restaurantes`
- **Descrição:** Rota para visualização de restaurantes disponíveis.

### 8. Detalhes do Pedido

- **Rota:** `/details-orders`
- **Descrição:** Rota para exibição detalhada de um pedido específico.


## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Se você tiver alguma dúvida, sinta-se à vontade para me contatar em [meu e-mail](mailto:pedrormont@gmail.com)









