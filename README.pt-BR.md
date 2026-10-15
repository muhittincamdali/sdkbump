<!-- i18n-source: README.md@e7c26ac3f2f831b9ddcef6819035e35fad0b96b1 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="Status da CI"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="Versão mais recente: v0.1.2"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="Versão da linguagem: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="Licença: MIT"></picture></a>
</p>

<p align="center">
<a href="#início-rápido"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-pt-BR-light.svg" alt="Começar"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-pt-BR-light.svg" alt="Documentação"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-pt-BR-light.svg" alt="Guias"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-pt-BR-light.svg" alt="Exemplos"></picture></a>
</p>

> Esta é uma tradução do README em inglês. Se houver diferença, vale a versão em inglês.

<!-- brand:end -->

Antes de publicar uma versão feita com o Xcode 27: o sdkbump verifica um projeto iOS nativo, Flutter ou React Native/Expo em busca do que o SDK do iOS 27 muda, começando pelo ciclo de vida do UIScene, e diz qual correção se aplica a cada achado. Ele lê os arquivos do seu projeto; não compila, não executa e não altera nada.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="sdkbump executado em um app React Native 0.87: não abre quando compilado com o SDK do iOS 27; SCN001 sem configuração de cena e SCN002 janela criada no app delegate, com três formas de corrigir"></picture>

<sub>Gravado com a CLI real no <a href="fixtures/rn-087">fixture rn-087</a>, um app React Native
0.87.1 criado com <code>@react-native-community/cli init</code> (<code>npm run demo</code>).</sub>

## Destaques

- **Responde "vai abrir?"** Um app que não declara nenhuma cena compila com o Xcode 27 e depois para na abertura. O sdkbump avisa antes que você descubra isso em um dispositivo de teste e indica os arquivos a alterar.
- **Nativo, Flutter, React Native e Expo** em um único relatório, com os mesmos IDs de regra, em texto, Markdown ou JSON, e com um código de saída para CI.
- **A correção que se aplica ao seu projeto**: React Native 0.88 ou um scene delegate escrito à mão, a adesão opcional do Expo SDK 57 ou o SDK 58, a migração automática do Flutter ou os passos manuais (o sdkbump verifica as mesmas condições que o migrador do Flutter), ou a API do SwiftUI para um app SwiftUI.
- **Também as quebras silenciosas**: métodos do app delegate e opções de inicialização que o UIKit deixa de usar quando o app tem uma cena (links, Handoff, ações rápidas, transições para primeiro e segundo plano) e buscas de janela que deixam de encontrar a janela certa.
- **Cada afirmação tem uma fonte.** As regras são dados ([rules/ios27.json](rules/ios27.json)) e cada uma cita as próprias páginas da Apple, do Flutter, do React Native ou do Expo; os testes falham se alguma não citar.
- **Verificado no simulador do iOS 27**: a falha de abertura e a tela preta por trás de SCN001 e SCN002 foram reproduzidas com o Xcode 27.0, e as gravações estão no repositório.

## Início rápido

Você precisa do [Node.js](https://nodejs.org/) 22.12 ou posterior (`node --version` mostra a versão; em um Mac, `brew install node` instala). Nada além disso.

**1. Abra um terminal na pasta do seu app**, a que tem o `.xcodeproj`, o `pubspec.yaml` ou o `package.json`:

```sh
cd path/to/YourApp
```

**2. Execute o sdkbump:**

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
```

O sdkbump ainda não está no npm (publicá-lo lá está planejado), então `npx sdkbump` não funciona por enquanto. O comando acima executa a versão 0.1.2 do GitHub; use-o em todo lugar onde este README disser `npx sdkbump`.

**3. Leia a primeira linha abaixo do nome do seu projeto.** "Fails to launch when built with the iOS 27 SDK" (não abre quando compilado com o SDK do iOS 27) significa que o app para na abertura até você corrigir os achados **ERROR**; cada um diz qual correção da lista "How to fix" se aplica. Os achados **WARNING** não impedem a abertura, mas deixam de funcionar quando o app tem uma cena. "Launch not determined" (abertura não determinada) significa que o sdkbump não conseguiu ler um Info.plist; as notas no fim do relatório dizem qual e por quê (veja Limites mais abaixo).

## O que muda quando você compila com o SDK do iOS 27

Da página da Apple
[Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle) (tradução):

> A partir do iOS 27, iPadOS 27, Mac Catalyst 27, tvOS 27 e visionOS 27, os apps compilados com o SDK mais recente precisam adotar o ciclo de vida baseado em cenas, ou não abrem.

1. **O app para na abertura se não declarar nenhuma cena.** Sem um `UIApplicationSceneManifest` com uma configuração no Info.plist e sem `application(_:configurationForConnecting:options:)`, o UIKit encerra o processo com a mensagem "UIScene life cycle is required for apps built with this SDK". O compilador não avisa, porque a verificação acontece quando o app inicia. React Native 0.87 e anteriores, Expo SDK 57 sem a adesão opcional e Expo SDK 56 e anteriores criam apps assim; o mesmo vale para apps Flutter que a ferramenta do Flutter não consegue migrar.
2. **Com uma cena, o app delegate deixa de receber eventos de interface.** Links, user activities, ações rápidas e as transições ativo/segundo plano vão para o scene delegate, e uma janela criada pelo app delegate nunca é exibida.

[Por que compila e mesmo assim trava](docs/guides/why-it-crashes.md) mostra a [matriz de abertura](examples/launch-matrix/README.md) que executamos no simulador do iOS 27.0.

## O que o sdkbump verifica

| Regra  | Gravidade | Achado                                                                                                                                                                                                  | Visto no simulador do iOS 27.0                                      |
| ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| SCN001 | error     | Sem configuração de cena: nenhum `UIApplicationSceneManifest` configurado, nenhum `configurationForConnecting`, e não é um `App` do SwiftUI; no Expo sem `ios/`, a versão do SDK e `enableSceneSupport` | para na abertura                                                    |
| SCN002 | error     | O app delegate cria a janela com `UIWindow(frame:)`                                                                                                                                                     | tela preta quando o app tem uma cena                                |
| SCN003 | warning   | Métodos do app delegate e chaves de opções de inicialização que o UIKit deixa de usar com cenas (13 no total), a menos que o scene delegate já os trate                                                 | `applicationDidEnterBackground(_:)` não é chamado em um app SwiftUI |
| SCN004 | warning   | Buscas de janela por `UIApplication.shared.keyWindow`, `.windows` ou pelo `window` do app delegate                                                                                                      | apenas avisos de descontinuação do compilador                       |

Dados das regras `ios27@2026.10.15`, verificados com o Xcode 27.0 (27A266a). Quando o React Native ou o Expo tem `react-native-uiscene-bridge` ou `react-native-xcode27` instalado, os achados que ele trata em tempo de execução aparecem como tratados, com os limites descritos no README dele, e não fazem a execução falhar.

## Instalação

O sdkbump ainda não está no npm; publicá-lo lá está planejado. Até lá, execute a versão 0.1.2 do GitHub como mostrado acima, ou adicione-a a um projeto:

```sh
npm install --save-dev https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.2/sdkbump-0.1.2.tgz
npx sdkbump
```

Quando o sdkbump estiver no npm, `npx sdkbump` baixará e executará a versão mais recente, e `npm install --save-dev sdkbump` fixará uma versão. Uma fórmula do Homebrew para `muhittincamdali/tap` é preparada pelo workflow de publicação (planejada junto com a primeira versão do tap).

## Uso

```text
sdkbump [path] [options]
```

| Opção                   | O que faz                                                                       |
| ----------------------- | ------------------------------------------------------------------------------- |
| `path`                  | Pasta do projeto ou `.xcodeproj`; o padrão é a pasta atual                      |
| `-f, --format <format>` | `tty` (padrão), `markdown` ou `json`                                            |
| `-o, --output <file>`   | Grava o relatório em um arquivo em vez de no terminal                           |
| `--fail-on <severity>`  | `error` (padrão), `warning`, `info` ou `none`: quando o código de saída é 1     |
| `--no-color`            | Texto simples mesmo em um terminal (`NO_COLOR` e `FORCE_COLOR` são respeitados) |

Códigos de saída: `0` nenhum achado não tratado no nível de `--fail-on` ou acima, `1` achados nesse nível ou acima, `2` argumentos inválidos, nenhum projeto iOS encontrado ou um erro inesperado.

O sdkbump encontra o app iOS sozinho: um `.xcodeproj` na raiz ou uma pasta abaixo para apps nativos, `ios/` para apps Flutter, React Native e Expo (`example/ios/` para um plugin do Flutter). Ele lê todos os targets de app iOS do arquivo de projeto, o Info.plist que cada um indica (XML ou binário) e os arquivos Swift e Objective-C do app, ignorando Pods, `node_modules`, a saída de compilação e os testes. Apps Expo sem `ios/` são verificados a partir do package.json e do app.json.

### Guardar um relatório em Markdown junto com o código

```sh
npx sdkbump --format markdown --output sdkbump.md
```

### Usar o relatório JSON em scripts

```sh
npx sdkbump --format json > sdkbump.json
```

Cada achado tem `rule`, `severity`, `file`, `line`, `message`, o `fix` com seus passos e seu guia, `alternatives`, `mitigation` (definido quando um pacote de contorno trata o achado) e `sources`. O formato é `schemaVersion` 0 e pode mudar antes da 1.0. [examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) o filtra com `jq`.

### Executar no CI

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) adiciona o relatório ao resumo do job de cada pull request que mexe no app iOS e faz o job falhar quando há erros.

### A partir do JavaScript

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Uma versão executável está em [examples/api/verdicts.mjs](examples/api/verdicts.mjs).

## Demonstração

As gravações de terminal vêm da CLI executada nos [fixtures](fixtures/README.md), projetos reais criados com cada toolchain:

| Projeto                                                     | Gravação                                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| App React Native 0.87.1                                     | no topo desta página                                                                    |
| App Flutter com um AppDelegate personalizado (Flutter 3.24) | [claro](docs/media/demo-flutter-light.svg) · [escuro](docs/media/demo-flutter-dark.svg) |
| App SwiftUI com um app delegate por adaptador               | [claro](docs/media/demo-swiftui-light.svg) · [escuro](docs/media/demo-swiftui-dark.svg) |

No simulador do iOS 27.0 (iPhone 17, compilado com o Xcode 27.0), o fixture nativo de UIKit para na abertura, e o mesmo app migrado para um scene delegate abre:

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="scripts/simulator-check.sh native-uikit no simulador do iOS 27.0: não está em execução 4 segundos após a abertura, com a linha do UIKit: Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Os fixtures native-uikit-scenes e native-swiftui em execução em um simulador de iPhone 17 com iOS 27.0, compilados com o Xcode 27.0"></p>

Medido em 15 de outubro de 2026 em um Mac (Apple silicon, M5 Max) com Node.js 26.11 enquanto outros trabalhos rodavam nele: três séries de 100 execuções de `node dist/cli/main.js` nos dez fixtures, incluindo a inicialização do Node.js. As medianas das três séries foram 0,11, 0,12 e 0,19 segundo; a execução mais lenta levou 0,33 segundo. Com a máquina mais carregada, os tempos aumentam.

## Status

| Recurso                                                                                                                  | Status          |
| ------------------------------------------------------------------------------------------------------------------------ | --------------- |
| Detecção de projetos nativos, Flutter (app e exemplo de plugin), React Native e Expo                                     | funciona        |
| SCN001 a SCN004 no Info.plist e nos fontes Swift/Objective-C do próprio app                                              | funciona        |
| Escolha da correção por ecossistema e versão; verificação da migração automática do Flutter; pacotes de contorno         | funciona        |
| Relatórios em terminal, Markdown e JSON; códigos de saída de `--fail-on`                                                 | funciona        |
| Dependências: Pods, `node_modules` e fontes de plugins do Flutter, com o nome do pacote                                  | planejado (0.2) |
| Aviso de contorno SCN005 como regra própria; DPT001 para deployment targets abaixo de 15.0                               | planejado (0.2) |
| `--verify`: compilar e abrir no simulador do iOS 27 a partir da CLI                                                      | planejado (0.3) |
| Árvores de sintaxe de Swift/Objective-C em vez de padrões; verificações de `.app` compilados; descontinuações do SiriKit | planejado (0.5) |
| `fix --dry-run` para apps nativos, saída SARIF, GitHub Action                                                            | planejado (0.8) |
| Esquema de regras e formato JSON estáveis                                                                                | planejado (1.0) |

## Limites

- **Padrões, não um compilador.** As regras são expressões regulares sobre texto Swift e Objective-C com comentários e strings apagados. Código gerado, escondido atrás de macros ou escrito de um jeito incomum pode passar despercebido ou ser detectado por engano. Árvores de sintaxe estão planejadas (0.5).
- **Só o código-fonte do próprio app.** Pods, `node_modules`, plugins do Flutter e outras dependências não são lidos, então um plugin que depende de métodos do app delegate que o UIKit não chama mais não é relatado. A verificação de dependências está planejada (0.2).
- **Configurações de build só do project.pbxproj.** O sdkbump lê `INFOPLIST_FILE` e `GENERATE_INFOPLIST_FILE` do arquivo do projeto e expande `$(SRCROOT)`, `$(PROJECT_DIR)`, `$(TARGET_NAME)` e `$(PRODUCT_NAME)`. Ele não lê arquivos `.xcconfig`, não expande outras configurações de build e não lê um Info.plist fora da pasta do projeto. Quando não consegue ler o Info.plist de um target, o SCN001 é um achado do tipo info e o veredito é "Launch not determined", em vez de um palpite.
- **Sem arquivo de supressão.** Um achado não pode ser marcado como revisado; `--fail-on` decide quais severidades fazem a execução falhar.
- **Só arquivos.** O sdkbump não compila nem abre o app; `--verify` está planejado (0.3).

## Documentação

Referência da API e guias: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## Guias

- [Por que compila e mesmo assim trava](docs/guides/why-it-crashes.md)
- [Apps nativos com UIKit e SwiftUI](docs/guides/native-ios.md)
- [Flutter: um AppDelegate personalizado e plugins](docs/guides/flutter.md)
- [React Native anterior à 0.88 e Expo anterior ao SDK 58](docs/guides/react-native-expo.md)
- [Autores de módulos nativos: links e notificações na inicialização a frio](docs/guides/native-module-authors.md)

## Ferramentas relacionadas

Outros projetos trabalham na mesma mudança; qual serve depende do que você precisa:

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) e [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) fazem um app React Native ou Expo abrir sem alterações de código, em tempo de execução. Servem quando você ainda não pode atualizar; o sdkbump os reconhece.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) audita apps Flutter e seus plugins com um script de shell.
- O migrador do próprio Flutter (`flutter build ios` a partir da 3.41) migra um app Flutter sem modificações.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) verifica plugins do Flutter.

## Requisitos

| Toolchain | Versão mínima |
| --------- | ------------- |
| Node.js   | 22.12         |

O sdkbump não precisa do Xcode: ele lê arquivos, então também roda no Linux. O CI executa os testes no Node.js 22 e 24 (Linux); localmente, os 280 passam no Node.js 22.23, 24.22 e 26.11 em um Mac (Apple silicon). As gravações do simulador exigem um Mac com Xcode 27 e não fazem parte do CI.

## Arquitetura

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- Os padrões de detecção são expressões regulares sobre o texto-fonte com comentários e strings em branco e, onde isso importa, só contam dentro de um app delegate ou de um scene delegate.
- Os dados das regras ficam separados do código e têm versão (`ios27@2026.10.15`); um teste falha quando uma regra, uma correção ou um contorno não tem fonte.
- A CLI (`src/cli/`) apenas interpreta os argumentos, escolhe cores e larguras e define o código de saída.

## Roteiro

Veja a tabela de [Status](#status): a 0.2 adiciona dependências e deployment targets, a 0.3 a abertura no simulador a partir da CLI, a 0.5 árvores de sintaxe e verificações do app compilado, a 0.8 correções e SARIF, a 1.0 um esquema estável. O [CHANGELOG.md](CHANGELOG.md) lista o que cada versão mudou.

## Perguntas frequentes

**Meu app funciona hoje no iOS 27. Ele é afetado?** Se foi compilado com o Xcode 26 ou anterior, a verificação não se aplica a essa compilação: no nosso teste, o mesmo código ligado ao SDK do iOS 26 abriu no simulador do iOS 27. Ela se aplica à sua próxima compilação com o Xcode 27.

**O sdkbump substitui o teste em um dispositivo?** Não. Ele lê arquivos. As gravações do simulador neste repositório são do simulador do iOS 27.0; nada aqui foi executado em um dispositivo.

**Por que um achado aparece como "tratado"?** Um pacote de contorno no package.json (react-native-uiscene-bridge ou react-native-xcode27) declara uma cena em tempo de execução. O app abre, mas continua sem suporte próprio a cenas; o relatório lista os limites do pacote e a correção de verdade.

**O sdkbump altera o meu projeto?** Não. Ele o lê e grava apenas o relatório que você pedir.


## Como contribuir

Contribuições são bem-vindas. Leia o [guia de contribuição](CONTRIBUTING.md) e o [código de conduta](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) antes de abrir um pull request. Relate problemas de segurança de forma privada, como descrito na [política de segurança](SECURITY.md).

## Licença

Publicado sob a licença MIT. Veja [LICENSE](LICENSE).
