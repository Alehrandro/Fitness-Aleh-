# 🏋️ Disciplina Fit

Aplicativo de treino em português, com tema escuro e detalhes em laranja. Monte seus treinos, execute-os série a série com cronômetro de descanso, acompanhe o calendário e veja sua evolução.

Feito em **HTML + CSS + JavaScript puro** — sem dependências, sem build. É um **PWA**: pode ser instalado no celular e funciona offline. Todos os dados ficam salvos **no próprio navegador** (`localStorage`); nada é enviado para servidores.

## ✨ Telas e funções

| Tela | O que faz |
|---|---|
| **Boas-vindas** | Entrada do app; no primeiro acesso pede seu nome |
| **Início** | Treino do dia, dias concluídos no mês, sequência atual, meta do mês e atalhos |
| **Treino** (aba) | Cartões deslizáveis, um por treino: dia da semana, nº de exercícios, minutos e calorias estimados, exercícios com miniatura e selo do músculo trabalhado. Botão **Iniciar treino**, **Personalizar** e **+** (criar treino) |
| **Treino** | Carrossel com um cartão por treino (nome, dia, nº de exercícios, minutos e calorias estimados, lista com miniatura, séries × repetições e selo do músculo). Deslize entre os treinos, toque em **Iniciar treino** para registrar séries e carga, com **cronômetro de descanso** automático (som + vibração), e em **Personalizar**/**+** para editar ou criar treinos |
| **Calendário mensal** | Navegação por mês, agendamento de treino/descanso em qualquer dia, marcação de dias concluídos |
| **Montar treino** | Nome, dias da semana (*Treinar em*), escolha de exercícios pelo **mapa muscular** (frente/costas → músculo → grade de exercícios, com favoritos ⭐, busca e como executar), ajuste de séries/repetições/descanso, reordenar e salvar |
| **Exercícios** | Biblioteca com mais de 60 exercícios (inclui cardio em minutos), busca e filtro por grupo, dica de execução e “adicionar a um treino” |
| **Perfil** | Foto (upload), estatísticas e atalhos |
| **Meus treinos** | Ver, editar, duplicar, excluir e definir o treino de hoje |
| **Meus dados** | Nome, nascimento, peso, altura e meta mensal |
| **Configurações** | Notificações e lembrete diário, unidade (kg/cm ↔ lb/in), senha de acesso, privacidade, excluir conta |
| **Progresso** | Visões *Mensal* e *Geral*: percentual da meta, treinos, sequência, tempo total e gráfico de evolução |
| **Ajuda** | Perguntas frequentes e como instalar no celular |

Extras: backup (exportar/importar JSON), dados de exemplo para conhecer o app, bloqueio por senha local.

## ▶️ Rodando localmente

Basta abrir o `index.html` no navegador. Para testar o modo PWA/offline, sirva por HTTP:

```bash
# com Python
python3 -m http.server 8080
# ou com Node
npx serve .
```

Acesse <http://localhost:8080>.

## 🚀 Publicando no GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/disciplina-fit.git
git push -u origin main
```

Para deixar o app online (GitHub Pages) existe um workflow pronto em `.github/workflows/pages.yml`:

1. No repositório, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. A cada `push` na branch `main`, o app é publicado em `https://SEU-USUARIO.github.io/disciplina-fit/`.

Todos os caminhos do app são relativos, então ele funciona normalmente dentro de um subcaminho do Pages.

## 📱 Instalando no celular

- **Android (Chrome):** menu ⋮ → *Instalar app*.
- **iPhone (Safari):** Compartilhar → *Adicionar à Tela de Início*.

## 🛠️ Modo administrador (imagens)

O administrador **AlehS** pode adicionar imagens aos exercícios e a **capa** do app (aparece na tela de boas-vindas e no topo do Início).

1. Vá em **Perfil → Configurações → Administrador**. No primeiro acesso, crie a senha do usuário `AlehS` (fica salva só no aparelho).
2. Toque em **Conectar pasta icons** e escolha a pasta `icons` do projeto (Chrome/Edge no computador).
3. Envie a capa e as imagens dos exercícios. Cada imagem é redimensionada e **gravada na pasta `icons/`** (`capa-inicio.jpg`, `ex-<id>.jpg`) e registrada em `icons/media.json`.
4. Faça `git add icons && git commit && git push` — todos os usuários passam a ver as imagens.

Sem suporte a pastas (celular, Firefox, Safari), a imagem é baixada e fica salva neste aparelho: coloque o arquivo e o `media.json` (botão *Baixar media.json*) em `icons/`.

> ⚠️ Em um app 100% estático, o acesso de admin é uma trava de interface, não segurança de servidor: o que realmente protege o conteúdo publicado é quem tem permissão de *push* no repositório.

## 🗂️ Estrutura

```
disciplina-fit/
├── index.html              # página única
├── css/style.css           # tema escuro/laranja
├── js/data.js              # banco de exercícios e treinos padrão
├── js/app.js               # telas, rotas, estado e ações
├── sw.js                   # service worker (offline)
├── manifest.webmanifest    # configuração do PWA
├── icons/                  # ícones do app + imagens do admin (media.json)
└── .github/workflows/      # deploy no GitHub Pages
```

## ⚠️ Observações

- Os dados ficam só neste navegador/aparelho. Limpar os dados do navegador os apaga — use **Configurações → Privacidade → Exportar backup**.
- O **lembrete de treino** é local (sem servidor): dispara quando o app está aberto ou ativo em segundo plano no aparelho. Lembretes com o app totalmente fechado exigiriam um servidor de push.
- A **senha** protege o acesso ao app no aparelho, mas não criptografa os dados armazenados.

## 📄 Licença

[MIT](LICENSE)
