<!-- i18n-source: README.md@cbffda47532294690b77084f8317610614e92e93 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/banner-light.svg" alt="sdkbump: Checks native iOS, Flutter and React Native apps for the iOS 27 SDK changes and names the fix for each."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/sdkbump/actions/workflows/ci.yml/badge.svg" alt="Estado de CI"></a>
<a href="https://github.com/muhittincamdali/sdkbump/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-version-light.svg" alt="Última versión: v0.1.2"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-language-light.svg" alt="Versión del lenguaje: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/badge-license-light.svg" alt="Licencia: MIT"></picture></a>
</p>

<p align="center">
<a href="#inicio-rápido"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-start-es-light.svg" alt="Empezar"></picture></a>
<a href="https://muhittincamdali.github.io/sdkbump/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-docs-es-light.svg" alt="Documentación"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-guides-es-light.svg" alt="Guías"></picture></a>
<a href="https://github.com/muhittincamdali/sdkbump/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/sdkbump/main/.github/brand/button-examples-es-light.svg" alt="Ejemplos"></picture></a>
</p>

> Esta es una traducción del README en inglés. Si hay diferencias, la versión en inglés es la vigente.

<!-- brand:end -->

Antes de publicar una versión compilada con Xcode 27: sdkbump revisa un proyecto iOS nativo, Flutter o React Native/Expo para detectar lo que cambia el SDK de iOS 27, empezando por el ciclo de vida de UIScene, y te dice qué solución corresponde a cada hallazgo. Lee los archivos de tu proyecto; no compila, no ejecuta ni modifica nada.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-rn-087-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-rn-087-light.svg"><img src="docs/media/demo-rn-087-light.svg" alt="sdkbump ejecutado sobre una app de React Native 0.87: no se inicia al compilarla con el SDK de iOS 27; SCN001 sin configuración de escena y SCN002 ventana creada en el app delegate, con tres formas de solucionarlo"></picture>

<sub>Grabado con la CLI real sobre el <a href="fixtures/rn-087">fixture rn-087</a>, una app de React
Native 0.87.1 creada con <code>@react-native-community/cli init</code> (<code>npm run demo</code>).</sub>

## Lo más destacado

- **Responde a «¿se iniciará?».** Una app que no declara ninguna escena se compila con Xcode 27 y luego se detiene al iniciarse. sdkbump te lo dice antes de que lo descubras en un dispositivo de pruebas y señala los archivos que hay que cambiar.
- **Nativo, Flutter, React Native y Expo** en un solo informe con los mismos ID de regla, en texto, Markdown o JSON, y con un código de salida para CI.
- **La solución que corresponde a tu proyecto**: React Native 0.88 o un scene delegate escrito a mano, la activación opcional de Expo SDK 57 o SDK 58, la migración automática de Flutter o los pasos manuales (sdkbump comprueba las mismas condiciones que el migrador de Flutter), o la API de SwiftUI para una app SwiftUI.
- **También los fallos silenciosos**: métodos del app delegate y opciones de lanzamiento que UIKit deja de usar cuando la app tiene una escena (enlaces, Handoff, acciones rápidas, paso a primer y segundo plano) y búsquedas de ventana que ya no encuentran la ventana correcta.
- **Cada afirmación tiene una fuente.** Las reglas son datos ([rules/ios27.json](rules/ios27.json)) y cada una cita las páginas de Apple, Flutter, React Native o Expo; las pruebas fallan si alguna no lo hace.
- **Comprobado en el simulador de iOS 27**: el fallo de inicio y la pantalla negra detrás de SCN001 y SCN002 se reprodujeron con Xcode 27.0, y las grabaciones están en el repositorio.

## Inicio rápido

Necesitas [Node.js](https://nodejs.org/) 22.12 o posterior (`node --version` muestra la versión; en un Mac, `brew install node` lo instala). Nada más.

**1. Abre una terminal en la carpeta de tu app**, la que contiene el `.xcodeproj`, el `pubspec.yaml` o el `package.json`:

```sh
cd path/to/YourApp
```

**2. Ejecuta sdkbump:**

```sh
npx https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.1/sdkbump-0.1.1.tgz
```

sdkbump todavía no está en npm (publicarlo ahí está planificado), así que por ahora `npx sdkbump` no funciona. El comando anterior ejecuta la versión 0.1.1 desde GitHub; úsalo donde este README diga `npx sdkbump`.

**3. Lee la primera línea bajo el nombre de tu proyecto.** «Fails to launch when built with the iOS 27 SDK» (no se inicia al compilarla con el SDK de iOS 27) significa que la app se detiene al iniciarse hasta que corrijas los hallazgos **ERROR**; cada uno indica qué solución de la lista «How to fix» corresponde. Los hallazgos **WARNING** no impiden el inicio, pero dejan de funcionar cuando la app tiene una escena. «Launch not determined» (no se puede determinar el inicio) significa que sdkbump no pudo leer un Info.plist; las notas al final del informe dicen cuál y por qué (consulta Límites más abajo).

## Qué cambia al compilar con el SDK de iOS 27

De la página de Apple
[Transitioning to the UIKit scene-based life cycle](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle) (traducción):

> A partir de iOS 27, iPadOS 27, Mac Catalyst 27, tvOS 27 y visionOS 27, las apps compiladas con el último SDK deben adoptar el ciclo de vida basado en escenas o no se iniciarán.

1. **La app se detiene al iniciarse si no declara ninguna escena.** Sin un `UIApplicationSceneManifest` con una configuración en Info.plist y sin `application(_:configurationForConnecting:options:)`, UIKit termina el proceso con el mensaje «UIScene life cycle is required for apps built with this SDK». El compilador no avisa, porque la comprobación se hace cuando la app arranca. React Native 0.87 y anteriores, Expo SDK 57 sin su activación opcional y Expo SDK 56 y anteriores crean apps así; también las apps Flutter que la herramienta de Flutter no puede migrar.
2. **Con una escena, el app delegate deja de recibir eventos de la interfaz.** Los enlaces, las user activities, las acciones rápidas y las transiciones activa/segundo plano pasan al scene delegate, y una ventana que cree el app delegate nunca se muestra.

[Por qué compila y aun así se bloquea](docs/guides/why-it-crashes.md) muestra la [matriz de inicio](examples/launch-matrix/README.md) que ejecutamos en el simulador de iOS 27.0.

## Qué revisa sdkbump

| Regla  | Gravedad | Hallazgo                                                                                                                                                                                                       | Observado en el simulador de iOS 27.0                              |
| ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| SCN001 | error    | Sin configuración de escena: ningún `UIApplicationSceneManifest` configurado, ningún `configurationForConnecting`, y no es una `App` de SwiftUI; en Expo sin `ios/`, la versión del SDK y `enableSceneSupport` | se detiene al iniciarse                                            |
| SCN002 | error    | El app delegate crea la ventana con `UIWindow(frame:)`                                                                                                                                                         | pantalla negra cuando la app tiene una escena                      |
| SCN003 | warning  | Métodos del app delegate y claves de opciones de lanzamiento que UIKit ya no usa con escenas (13 en total), salvo que el scene delegate ya los gestione                                                        | `applicationDidEnterBackground(_:)` no se llama en una app SwiftUI |
| SCN004 | warning  | Búsquedas de ventana mediante `UIApplication.shared.keyWindow`, `.windows` o el `window` del app delegate                                                                                                      | solo avisos de obsolescencia del compilador                        |

Datos de reglas `ios27@2026.10.15`, comprobados con Xcode 27.0 (27A266a). Cuando React Native o Expo tienen instalado `react-native-uiscene-bridge` o `react-native-xcode27`, los hallazgos que estos gestionan en tiempo de ejecución se muestran como gestionados, con los límites indicados en su README, y no hacen fallar la ejecución.

## Instalación

sdkbump todavía no está en npm; publicarlo ahí está planificado. Mientras tanto, ejecuta la versión 0.1.1 desde GitHub como se muestra arriba, o añádelo a un proyecto:

```sh
npm install --save-dev https://github.com/muhittincamdali/sdkbump/releases/download/v0.1.1/sdkbump-0.1.1.tgz
npx sdkbump
```

Cuando sdkbump esté en npm, `npx sdkbump` descargará y ejecutará la última versión, y `npm install --save-dev sdkbump` fijará una. El workflow de publicación prepara una fórmula de Homebrew para `muhittincamdali/tap` (planificada con la primera versión del tap).

## Uso

```text
sdkbump [path] [options]
```

| Opción                  | Qué hace                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `path`                  | Carpeta del proyecto o `.xcodeproj`; por defecto, la carpeta actual                |
| `-f, --format <format>` | `tty` (por defecto), `markdown` o `json`                                           |
| `-o, --output <file>`   | Escribe el informe en un archivo en lugar de en la terminal                        |
| `--fail-on <severity>`  | `error` (por defecto), `warning`, `info` o `none`: cuándo el código de salida es 1 |
| `--no-color`            | Texto sin formato incluso en una terminal (se respetan `NO_COLOR` y `FORCE_COLOR`) |

Códigos de salida: `0` ningún hallazgo sin gestionar en `--fail-on` o por encima, `1` hallazgos en ese nivel o por encima, `2` argumentos incorrectos, no se encontró ningún proyecto iOS o un error inesperado.

sdkbump encuentra la app iOS por sí mismo: un `.xcodeproj` en la raíz o una carpeta más abajo para las apps nativas, `ios/` para las apps Flutter, React Native y Expo (`example/ios/` para un plugin de Flutter). Lee todos los targets de app iOS del archivo de proyecto, el Info.plist que nombra cada uno (XML o binario) y los archivos Swift y Objective-C de la app, y omite Pods, `node_modules`, la salida de compilación y las pruebas. Las apps Expo sin `ios/` se comprueban a partir de package.json y app.json.

### Guardar un informe en Markdown junto al código

```sh
npx sdkbump --format markdown --output sdkbump.md
```

### Usar el informe JSON en scripts

```sh
npx sdkbump --format json > sdkbump.json
```

Cada hallazgo tiene `rule`, `severity`, `file`, `line`, `message`, el `fix` con sus pasos y su guía, `alternatives`, `mitigation` (se establece cuando lo resuelve un paquete de solución provisional) y `sources`. El formato es `schemaVersion` 0 y puede cambiar antes de la 1.0. [examples/shell/launch-blockers.sh](examples/shell/launch-blockers.sh) lo filtra con `jq`.

### Ejecutarlo en CI

[examples/github-actions/sdkbump.yml](examples/github-actions/sdkbump.yml) añade el informe al resumen del job de cada pull request que toque la app iOS y hace fallar el job si hay errores.

### Desde JavaScript

```js
import { render, scan } from 'sdkbump';

const report = await scan('path/to/app');
console.log(report.verdict.text);
console.log(render(report, 'markdown'));
```

Una versión ejecutable es [examples/api/verdicts.mjs](examples/api/verdicts.mjs).

## Demo

Las grabaciones de terminal proceden de la CLI ejecutada sobre los [fixtures](fixtures/README.md), proyectos reales creados con cada toolchain:

| Proyecto                                                       | Grabación                                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| App de React Native 0.87.1                                     | al principio de esta página                                                             |
| App de Flutter con un AppDelegate personalizado (Flutter 3.24) | [claro](docs/media/demo-flutter-light.svg) · [oscuro](docs/media/demo-flutter-dark.svg) |
| App de SwiftUI con un app delegate mediante adaptador          | [claro](docs/media/demo-swiftui-light.svg) · [oscuro](docs/media/demo-swiftui-dark.svg) |

En el simulador de iOS 27.0 (iPhone 17, compilado con Xcode 27.0), el fixture nativo de UIKit se detiene al iniciarse, y la misma app migrada a un scene delegate se inicia:

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-simulator-native-uikit-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-simulator-native-uikit-light.svg"><img src="docs/media/demo-simulator-native-uikit-light.svg" alt="scripts/simulator-check.sh native-uikit en el simulador de iOS 27.0: no se está ejecutando 4 segundos después del inicio, con la línea de UIKit: Application failed to launch: UIScene life cycle is required for apps built with this SDK"></picture>

<p align="center"><img src="docs/media/simulator/launched.png" width="480" alt="Los fixtures native-uikit-scenes y native-swiftui ejecutándose en un simulador de iPhone 17 con iOS 27.0, compilados con Xcode 27.0"></p>

Medido el 15 de octubre de 2026 en un Mac (Apple silicon, M5 Max) con Node.js 26.11 mientras ejecutaba otros trabajos: tres series de 100 ejecuciones de `node dist/cli/main.js` sobre los diez fixtures, incluido el arranque de Node.js. Las medianas de las tres series fueron 0,11, 0,12 y 0,19 segundos; la ejecución más lenta tardó 0,33 segundos. Con más carga en la máquina, los tiempos son mayores.

## Estado

| Función                                                                                                                                 | Estado            |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Detección de proyectos nativos, Flutter (app y ejemplo de plugin), React Native y Expo                                                  | funciona          |
| SCN001 a SCN004 sobre el Info.plist y los fuentes Swift/Objective-C de la propia app                                                    | funciona          |
| Selección de la solución por ecosistema y versión; comprobación de la migración automática de Flutter; paquetes de solución provisional | funciona          |
| Informes en terminal, Markdown y JSON; códigos de salida de `--fail-on`                                                                 | funciona          |
| Dependencias: Pods, `node_modules` y fuentes de plugins de Flutter, con el nombre del paquete                                           | planificado (0.2) |
| Aviso de solución provisional SCN005 como regla propia; DPT001 para deployment targets inferiores a 15.0                                | planificado (0.2) |
| `--verify`: compilar e iniciar en el simulador de iOS 27 desde la CLI                                                                   | planificado (0.3) |
| Árboles de sintaxis de Swift/Objective-C en lugar de patrones; comprobaciones de `.app` compiladas; obsolescencias de SiriKit           | planificado (0.5) |
| `fix --dry-run` para apps nativas, salida SARIF, GitHub Action                                                                          | planificado (0.8) |
| Esquema de reglas y formato JSON estables                                                                                               | planificado (1.0) |

## Límites

- **Patrones, no un compilador.** Las reglas son expresiones regulares sobre texto Swift y Objective-C con los comentarios y las cadenas en blanco. El código generado, oculto tras macros o escrito de una forma poco habitual puede pasarse por alto o detectarse por error. Los árboles de sintaxis están planificados (0.5).
- **Solo las fuentes propias de la app.** No se leen Pods, `node_modules`, plugins de Flutter ni otras dependencias, así que no se informa de un plugin que dependa de métodos del app delegate que UIKit ya no llama. La revisión de dependencias está planificada (0.2).
- **Ajustes de compilación solo de project.pbxproj.** sdkbump lee `INFOPLIST_FILE` y `GENERATE_INFOPLIST_FILE` del archivo del proyecto y expande `$(SRCROOT)`, `$(PROJECT_DIR)`, `$(TARGET_NAME)` y `$(PRODUCT_NAME)`. No lee archivos `.xcconfig`, no expande otros ajustes de compilación y no lee un Info.plist fuera de la carpeta del proyecto. Cuando no puede leer el Info.plist de un target, SCN001 es un hallazgo de tipo info y el veredicto es «Launch not determined» en lugar de una suposición.
- **Sin archivo de supresión.** Un hallazgo no se puede marcar como revisado; `--fail-on` decide qué severidades hacen fallar la ejecución.
- **Solo archivos.** sdkbump no compila ni inicia la app; `--verify` está planificado (0.3).

## Documentación

Referencia de la API y guías: [muhittincamdali.github.io/sdkbump](https://muhittincamdali.github.io/sdkbump/).

## Guías

- [Por qué compila y aun así se bloquea](docs/guides/why-it-crashes.md)
- [Apps nativas con UIKit y SwiftUI](docs/guides/native-ios.md)
- [Flutter: un AppDelegate personalizado y plugins](docs/guides/flutter.md)
- [React Native anterior a 0.88 y Expo anterior a SDK 58](docs/guides/react-native-expo.md)
- [Autores de módulos nativos: enlaces y notificaciones en el arranque en frío](docs/guides/native-module-authors.md)

## Herramientas relacionadas

Otros proyectos trabajan en el mismo cambio; cuál te conviene depende de lo que necesites:

- [react-native-uiscene-bridge](https://github.com/Atomics-hub/react-native-uiscene-bridge) y [react-native-xcode27](https://github.com/Atomics-hub/react-native-xcode27) hacen que una app de React Native o Expo se inicie sin cambios de código, en tiempo de ejecución. Sirven cuando todavía no puedes actualizar; sdkbump los reconoce.
- [auditor-uiscene](https://github.com/Anzell/auditor-uiscene) audita apps Flutter y sus plugins con un script de shell.
- El propio migrador de Flutter (`flutter build ios` desde la 3.41) migra una app Flutter sin modificar.
- [flutter_spm_doctor](https://pub.dev/packages/flutter_spm_doctor) revisa los plugins de Flutter.

## Requisitos

| Toolchain | Versión mínima |
| --------- | -------------- |
| Node.js   | 22.12          |

sdkbump no necesita Xcode: lee archivos, así que también funciona en Linux. CI ejecuta las pruebas en Node.js 22 y 24 (Linux); en local, las 269 pasan en Node.js 22.23, 24.22 y 26.11 en un Mac (Apple silicon). Las grabaciones del simulador requieren un Mac con Xcode 27 y no forman parte de CI.

## Arquitectura

```text
path ─► detectProject      native | flutter | react-native | expo; iOS folder; versions
     ─► collectApp         iOS app targets from project.pbxproj, their Info.plist (XML or binary),
                           Swift and Objective-C sources with comments and strings blanked
     ─► checkApp           SCN001…SCN004, fix per ecosystem and version, workaround packages
          rules/ios27.json  what each rule says, fixes, sources (validated with zod)
     ─► render             tty | markdown | json
```

- Los patrones de detección son expresiones regulares sobre el texto fuente con los comentarios y las cadenas en blanco, y, cuando importa, solo cuentan dentro de un app delegate o un scene delegate.
- Los datos de las reglas están separados del código y tienen versión (`ios27@2026.10.15`); una prueba falla cuando una regla, una solución o una solución provisional no tiene fuente.
- La CLI (`src/cli/`) solo interpreta los argumentos, elige los colores y los anchos, y establece el código de salida.

## Hoja de ruta

Consulta la tabla de [Estado](#estado): la 0.2 añade dependencias y deployment targets, la 0.3 el inicio en el simulador desde la CLI, la 0.5 árboles de sintaxis y comprobaciones de la app compilada, la 0.8 correcciones y SARIF, y la 1.0 un esquema estable. [CHANGELOG.md](CHANGELOG.md) enumera lo que cambió en cada versión.

## Preguntas frecuentes

**Mi app funciona hoy en iOS 27. ¿Le afecta?** Si se compiló con Xcode 26 o anterior, la comprobación no se aplica a esa compilación: en nuestra prueba, el mismo código enlazado con el SDK de iOS 26 se inició en el simulador de iOS 27. Se aplica a tu próxima compilación con Xcode 27.

**¿Sustituye sdkbump las pruebas en un dispositivo?** No. Lee archivos. Las grabaciones del simulador de este repositorio son del simulador de iOS 27.0; nada de lo que hay aquí se ejecutó en un dispositivo.

**¿Por qué un hallazgo aparece como «gestionado»?** Un paquete de solución provisional en package.json (react-native-uiscene-bridge o react-native-xcode27) declara una escena en tiempo de ejecución. La app se inicia, pero sigue sin tener soporte de escenas propio; el informe enumera los límites del paquete y la solución real.

**¿Modifica sdkbump mi proyecto?** No. Lo lee y solo escribe el informe que le pidas.


## Contribuir

Las contribuciones son bienvenidas. Lee la [guía de contribución](CONTRIBUTING.md) y el [código de conducta](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) antes de abrir una pull request. Informa de los problemas de seguridad de forma privada, como se describe en la [política de seguridad](SECURITY.md).

## Licencia

Publicado bajo la licencia MIT. Consulta [LICENSE](LICENSE).
