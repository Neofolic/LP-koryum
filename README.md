# Koryum · landing page

React 18 + Vite, feita do zero, sem biblioteca de componentes. Marca do Koryum (Figma KORYUM-NOVO).
Estrutura inspirada na página da Clínica Experts. Construída seção por seção.

## Status

- Seção 1, abertura: pronta. A tela da agenda é uma reprodução fiel da tela "Agenda · Todos · Semana" do Figma.

## Antes de publicar

1. `src/config.js`: preencha `WHATSAPP_NUMBER` (só dígitos, com 55 e DDD).
2. Foto da abertura: salve a foto da Neofolic em `public/hero.jpg` e, em `src/config.js`, troque `HERO_PHOTO` para `'/hero.jpg'`.

## Formulário "Falar com um especialista"

- Todos os botões "Falar com um especialista" abrem o formulário.
- `WEBHOOK_URL` (em `src/config.js`): recebe um POST em JSON com nome, whatsapp (com o código do país), ddi, email, instagram ("@perfil"),
  segmento, profissionais, origem (UTMs, gclid, fbclid, página e referência) e enviado_em.
  Vazio = modo de teste (não envia, só segue para a confirmação).
- O webhook precisa responder 2xx e liberar CORS para o domínio do site (no n8n: Allowed Origins).
  Se responder erro, o formulário mostra uma mensagem e mantém os dados preenchidos.
- Confirmação: depois do envio vai para `/obrigado` (mesmo app; a Cloudflare Pages entrega o index.html nesse endereço).
  É a página para colocar os eventos de conversão (Meta, Google).
- `POLITICA_URL`: link da Política de privacidade, exigido pela LGPD. Precisa existir antes de publicar.

## Rodar e publicar

```bash
npm install
npm run dev      # na máquina
npm run build    # gera a pasta dist
```

Cloudflare Pages: preset Vite, build `npm run build`, saída `dist`, Node 18 ou mais novo.
