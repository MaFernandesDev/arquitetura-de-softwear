# TechStore — refatoração SOLID

## Requisitos
Node.js 20 ou superior.

## Executar
```bash
npm start
```

## Testes automatizados
```bash
npm test
```

## Decisões de arquitetura
`OrderService` coordena o caso de uso e recebe suas dependências por composição/injeção. Regras de desconto, frete, pagamento e notificação ficam em serviços coesos. Repositórios permanecem responsáveis pelo acesso aos dados em memória. A implementação mantém o exemplo didático sem dependências externas.

## Publicar no GitHub
Crie um repositório vazio no GitHub e execute, na pasta deste projeto:
```bash
git init
git add .
git commit -m "Refatora projeto aplicando SOLID"
git branch -M main
git remote add origin https://github.com/MaFernandesDev/arquitetura-de-softwear
git push -u origin main
```