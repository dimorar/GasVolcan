# Guía paso a paso · DSY1104

## Tienda GasVolcan con Vite, React, React Router, Vitest, Playwright y GitHub Pages

Esta guía construye el proyecto **desde una carpeta vacía** hasta tenerlo publicado en internet.
En cada paso se explica **qué hacemos** y **por qué lo hacemos**. Todos los comandos se escriben en la
terminal (en Windows puedes usar PowerShell o la terminal integrada de VS Code).

> 💡 Si solo quieres **ejecutar** el proyecto ya terminado, ve directo a la [Parte 0](#parte-0--ejecutar-el-proyecto-terminado).

---

## Índice

0. [Ejecutar el proyecto terminado](#parte-0--ejecutar-el-proyecto-terminado)
1. [Requisitos previos](#parte-1--requisitos-previos)
2. [Crear el proyecto con Vite + React Compiler](#parte-2--crear-el-proyecto-con-vite--react-compiler)
3. [Entender lo que se generó](#parte-3--entender-lo-que-se-generó)
4. [Agregar React Router](#parte-4--agregar-react-router)
5. [Estado, datos y servicios](#parte-5--estado-datos-y-servicios)
6. [Pruebas unitarias con Vitest](#parte-6--pruebas-unitarias-y-de-componentes-con-vitest) · [Cobertura](#65-cobertura-de-código-con-vitest)
7. [Pruebas end-to-end con Playwright](#parte-7--pruebas-end-to-end-con-playwright)
8. [Preparar el proyecto para GitHub Pages](#parte-8--preparar-el-proyecto-para-github-pages)
9. [Subir a GitHub y desplegar](#parte-9--subir-a-github-y-desplegar)
10. [Problemas frecuentes](#parte-10--problemas-frecuentes)

---

## Parte 0 · Ejecutar el proyecto terminado

```
npm install                       # 1. instala las dependencias listadas en package.json
npx playwright install chromium   # 2. descarga el navegador que usa Playwright (solo la primera vez)
npm run dev                       # 3. abre http://localhost:5173
```

Para verificar que todo funciona:

```
npm run lint           # revisa el estilo y errores comunes del código
npm run test:run       # pruebas unitarias y de componentes (Vitest)
npm run test:coverage  # las mismas pruebas + informe de cobertura (coverage/index.html)
npm run test:e2e       # pruebas en navegador real (Playwright)
npm run build          # genera la versión de producción en dist/
```

Usuario administrador de prueba: `admin@duoc.cl` / `admin123` (entra en **Iniciar sesión**).

---

## Parte 1 · Requisitos previos

| Herramienta            | Versión recomendada                             | Para qué sirve                                                                       | Cómo comprobarla |
| ---------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------- |
| **Node.js**            | 22 LTS o superior (el proyecto se probó con 24) | Ejecuta JavaScript fuera del navegador. Vite, Vitest y Playwright corren sobre Node. | `node -v`        |
| **npm**                | viene con Node                                  | Gestor de paquetes: descarga librerías desde el registro npm.                        | `npm -v`         |
| **Git**                | cualquiera reciente                             | Control de versiones; necesario para subir el código a GitHub.                       | `git --version`  |
| **Cuenta de GitHub**   | —                                               | Para alojar el repositorio y publicar con GitHub Pages.                              | —                |
| **VS Code** (opcional) | —                                               | Editor. Extensiones útiles: *ESLint*, *Playwright Test for VSCode*, *Vitest*.        | —                |

> 📥 Node.js se descarga desde <https://nodejs.org> (elige la versión **LTS**).
> Si un comando no se reconoce después de instalar, **cierra y vuelve a abrir la terminal**.

Configura tu identidad en Git (solo una vez por computador):

```
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

**¿Por qué?** Cada *commit* queda firmado con este nombre y correo; GitHub los usa para asociar los
cambios a tu cuenta.

---

## Parte 2 · Crear el proyecto con Vite + React Compiler

### 2.1 Generar el proyecto

```
npm create vite@latest gasvolcan
```

| Pregunta                                | Respuesta                                          |
| --------------------------------------- | -------------------------------------------------- |
| *Select a framework*                    | **React**                                          |
| *Select a variant*                      | **JavaScript + React Compiler**                    |
| *Use ESLint or Oxlint?* (según versión) | **ESLint**                                         |
| *Install with npm and start now?*       | **No** (lo haremos a mano para entender cada paso) |

> ⚡ Versión no interactiva:
>
> ```
> npm create vite@latest gasvolcan -- --template react-compiler --eslint --no-interactive
> ```

**¿Qué es Vite?** Es la herramienta de *build*: un servidor de desarrollo muy rápido (recarga el
navegador al guardar) y un empaquetador que optimiza el código para producción.

**¿Qué es el React Compiler?** Un plugin que analiza tus componentes al compilar y los **memoriza
automáticamente**. Antes había que usar `useMemo`, `useCallback` y `React.memo` a mano; con el
compilador escribimos código simple y él optimiza.

### 2.2 Entrar a la carpeta e instalar dependencias

```
cd gasvolcan
npm install
```

**¿Qué pasa aquí?** npm lee `package.json`, descarga todas las librerías a `node_modules/` y crea
`package-lock.json`, que "congela" las versiones exactas para que todos los compañeros (y GitHub
Actions) instalen lo mismo.

> ⚠️ `node_modules/` **nunca** se sube a GitHub (ya está en `.gitignore`). Se regenera con `npm install`.

### 2.3 Probar que funciona

```
npm run dev
```

Abre <http://localhost:5173>. Deberías ver la página de bienvenida de Vite + React.
Detén el servidor con **Ctrl + C**.

---

## Parte 3 · Entender lo que se generó

```
gasvolcan/
├── index.html          ← la ÚNICA página HTML. React se monta en <div id="root">
├── package.json        ← nombre del proyecto, scripts y dependencias
├── vite.config.js      ← configuración de Vite (React Compiler, Vitest y cobertura)
├── eslint.config.js    ← reglas de calidad de código
├── playwright.config.js← configuración de las pruebas E2E
├── public/             ← archivos que se copian tal cual (favicon, imágenes, regiones.json)
└── src/
    ├── main.jsx        ← punto de entrada: crea la raíz de React
    ├── App.jsx         ← tabla de rutas
    └── index.css       ← estilos globales
```

Mira `vite.config.js`:

```
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }), // ← esto activa el React Compiler
  ],
})
```

**Dependencias vs. dependencias de desarrollo** (en `package.json`):

- `dependencies`: se necesitan **en el navegador** (react, react-dom, react-router).
- `devDependencies`: solo se usan **mientras desarrollamos** (vite, eslint, vitest, playwright).
  Se instalan con `npm install -D`.

---

## Parte 4 · Agregar React Router

### 4.1 Instalar

```
npm install react-router
```

**¿Para qué?** Una app React es una sola página (SPA). React Router hace que distintas URLs
(`/catalogo`, `/admin`, …) muestren distintos componentes **sin recargar** la página.

### 4.2 Envolver la app con un Router — `src/main.jsx`

```
import { HashRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
```

**¿Por qué `HashRouter` y no `BrowserRouter`?** GitHub Pages es un servidor de archivos estáticos.
Con `BrowserRouter`, si alguien recarga `https://usuario.github.io/gasvolcan/catalogo`, el servidor
busca un archivo `catalogo` que no existe → **error 404**. Con `HashRouter` la URL queda
`https://usuario.github.io/gasvolcan/#/catalogo`: todo lo que va después de `#` **nunca se envía al
servidor**, así que siempre se carga `index.html` y React Router resuelve la ruta.

### 4.3 Definir las rutas — `src/App.jsx`

```
<Routes>
  <Route element={<Layout />}>                                   {/* navbar + footer */}
    <Route index element={<Home />} />                           {/* /             */}
    <Route path="catalogo" element={<Catalogo />} />             {/* /catalogo     */}
    <Route path="contacto" element={<Contacto />} />             {/* /contacto     */}
    <Route path="login" element={<Login />} />                   {/* /login        */}
    <Route path="mis-pedidos" element={<RutaProtegida><MisPedidos /></RutaProtegida>} />
    <Route path="admin" element={<RutaProtegida soloAdmin><Admin /></RutaProtegida>} />
    <Route path="*" element={<NotFound />} />                    {/* cualquier otra → 404 */}
  </Route>
</Routes>
```

Conceptos clave que usa el proyecto:

| API                  | Dónde                          | Para qué                                                                          |
| -------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| `<Outlet />`         | `components/Layout.jsx`        | Lugar donde se dibuja la página hija de la ruta actual.                           |
| `<NavLink>`          | `components/Navbar.jsx`        | Como `<Link>`, pero agrega la clase `active` al link de la página actual.         |
| `<Link>`             | portada, checkout              | Navega sin recargar (nunca uses `<a href>` para rutas internas).                  |
| `<Navigate>`         | `components/RutaProtegida.jsx` | Redirige a `/login` cuando se entra a una ruta protegida sin sesión.              |
| `useLocation()`      | `pages/Login.jsx`              | Lee a qué página se quería entrar (`state.desde`) para volver después de ingresar. |
| `useNavigate()`      | `Navbar.jsx`, `Login.jsx`      | Navega desde código (al cerrar sesión o iniciar sesión).                          |

---

## Parte 5 · Estado, datos y servicios

GasVolcan **no tiene backend**: los datos viven en el navegador (`localStorage`). Por eso esta parte
reemplaza al consumo de APIs externas y se centra en cómo organizar el estado.

### 5.1 Un hook reutilizable — `src/hooks/useLocalStorage.js`

Funciona como `useState`, pero guarda el valor en `localStorage` para que **sobreviva a recargas**:

```
const [carrito, setCarrito] = useLocalStorage('gv-carrito-v1', {})
```

Si el JSON guardado está corrupto o el navegador bloquea el almacenamiento, el hook vuelve al valor
inicial en vez de romper la app.

### 5.2 Estado global — `src/context/`

`StoreProvider.jsx` crea **un solo lugar** con productos, carrito, usuarios, sesión y pedidos, y los
comparte con toda la app mediante Context. Los componentes lo leen con el hook `useStore()`.

> 💡 Las claves de `localStorage` llevan versión (`gv-productos-v1`). Si cambias los datos iniciales,
> sube el número (`v2`) para que los navegadores no sigan usando datos viejos.

### 5.3 Servicios — `src/services/`

Funciones **puras** (sin React) con la lógica del negocio:

| Archivo         | Qué hace                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| `validation.js` | RUN (módulo 11), correos permitidos, mensaje y contraseña.                     |
| `products.js`   | Catálogo inicial, filtrar/ordenar, stock crítico, descuento de stock.          |
| `cart.js`       | Agregar, sumar/restar y quitar productos respetando el stock.                  |
| `orders.js`     | Crear pedido, estados (Pendiente → En reparto → Entregado/Cancelado), reponer stock. |
| `users.js`      | Validar, crear, editar, eliminar y autenticar usuarios (sin RUN ni correo repetidos). |
| `regiones.js`   | Ruta del JSON de regiones y comunas por región.                                |

**¿Por qué separar?** Las funciones puras son **fáciles de probar** (Parte 6) y si una regla de negocio
cambia, se modifica en un solo lugar.

### 5.4 `useFetch` para `public/data/regiones.json`

`src/hooks/useFetch.js` pide un JSON y devuelve `{ data, error, loading }`. Detalles importantes:

- Usa `AbortController` para **cancelar** la petición anterior si cambia la URL o se sale de la página.
- Revisa `res.ok`: `fetch` **no** lanza error ante un 404, hay que comprobarlo a mano.
- La URL usa `import.meta.env.BASE_URL` para funcionar bajo `base: './'` (ver Parte 8).

### 5.5 Páginas

| Página           | Qué practica                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| `Home.jsx`       | Componentes, JSX, listas con `key`                                          |
| `Catalogo.jsx`   | Filtros controlados, carrito persistente, checkout (HU-01)                  |
| `Contacto.jsx`   | Formulario controlado con validación de RUN y correo (HU-02)                |
| `Login.jsx`      | Autenticación simulada y redirección a la página de origen                  |
| `MisPedidos.jsx` | Ruta protegida, historial del usuario conectado                             |
| `Admin.jsx`      | Ruta solo Admin: pedidos, inventario con stock crítico y CRUD de usuarios (HU-03) |

> ⚠️ Las contraseñas en texto plano dentro del navegador **no son seguras**. Es solo una demo: en un
> sistema real la autenticación se hace en un backend.

---

## Parte 6 · Pruebas unitarias y de componentes con Vitest

### 6.1 Instalar

```
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

| Paquete                       | Rol                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `vitest`                      | *Test runner* nativo de Vite (misma configuración, muy rápido). API compatible con Jest. |
| `jsdom`                       | Simula un navegador (DOM) dentro de Node, para renderizar componentes sin abrir Chrome.  |
| `@testing-library/react`      | Renderiza componentes y los busca **como lo haría un usuario** (por texto, rol, label).  |
| `@testing-library/jest-dom`   | Agrega verificaciones como `toBeInTheDocument()` o `toHaveAttribute()`.                  |
| `@testing-library/user-event` | Simula clics y escritura de forma realista.                                              |

### 6.2 Configurar — `vite.config.js`

```
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
```

`src/test/setup.js` contiene una línea: `import '@testing-library/jest-dom/vitest'`.

### 6.3 Scripts en `package.json`

```
"test": "vitest",          // modo watch: re-ejecuta al guardar
"test:run": "vitest run"   // una sola vez (para CI)
```

### 6.4 Qué pruebas hay

- `src/services/*.test.js` → **pruebas unitarias** de funciones puras (RUN, carrito, pedidos, usuarios…).
- `src/components/**/*.test.jsx` y `src/pages/*.test.jsx` → **pruebas de componentes**: renderizan cada
  pieza dentro de un `MemoryRouter` y del `StoreProvider` y la usan como un usuario.
- `src/hooks/*.test.jsx` → pruebas de los hooks.
- `src/test/` → ayudas compartidas: `renderWithRouter`, `renderConStore`, datos y mocks.

**Mocks:** las pruebas **no leen archivos reales**. `src/test/mocks.js` reemplaza `fetch` con
`vi.stubGlobal('fetch', …)` y devuelve las regiones de prueba. Así son rápidas y repetibles.

```
npm run test:run
```

Resultado esperado: `Tests  87 passed (87)`.

### 6.5 Cobertura de código con Vitest

**¿Qué es la cobertura?** Mide **qué partes del código se ejecutaron** mientras corrían las pruebas.
No dice si las pruebas son *buenas*, pero sí muestra qué código **nadie está probando**.

#### 6.5.1 Instalar el proveedor de cobertura

```
npm install -D @vitest/coverage-v8
```

> ⚠️ Su versión **debe coincidir** con la de `vitest`. Compruébalo con `npm ls vitest @vitest/coverage-v8`.

#### 6.5.2 Configurar — `vite.config.js`

```
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    include: ['src/**/*.{js,jsx}'],
    exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
    thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
},
```

| Opción       | Por qué                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `reporter`   | `text` imprime la tabla; `html` genera `coverage/index.html`; `lcov` lo leen VS Code, SonarQube, Codecov. |
| `include`    | Sin esto, un archivo **sin ninguna prueba** pasaría inadvertido.                                         |
| `exclude`    | No tiene sentido medir los propios tests, los mocks ni `main.jsx`.                                       |
| `thresholds` | **Mínimos obligatorios**: si baja del 80 %, el comando falla y el CI se detiene.                         |

El React Compiler se desactiva **solo durante las pruebas**:

```
plugins: [
  react(),
  !process.env.VITEST && babel({ presets: [reactCompilerPreset()] }),
],
```

**¿Por qué?** El compilador agrega condiciones internas de caché que la cobertura contaría como ramas
"no probadas" aunque no las escribimos nosotros.

#### 6.5.3 Ejecutar y leer el informe

```
npm run test:coverage
```

| Columna                | Qué mide                                                                         |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Stmts** (sentencias) | Instrucciones ejecutadas al menos una vez.                                       |
| **Branch** (ramas)     | Cada camino de un `if`, `? :`, `&&`.                                             |
| **Funcs** (funciones)  | Funciones que se llamaron al menos una vez.                                      |
| **Lines** (líneas)     | Líneas ejecutadas.                                                               |
| **Uncovered Line #s**  | Líneas exactas que ninguna prueba ejecutó: **por ahí empezar a escribir tests**. |

Abre `coverage/index.html` en el navegador: las líneas en **rojo** no se ejecutaron.

> 🎯 **100 % no es la meta.** Un 80–90 % con pruebas que verifican comportamiento real vale más
> que un 100 % logrado con tests que solo "pasan por" el código.

---

## Parte 7 · Pruebas end-to-end con Playwright

### 7.1 Instalar

```
npm install -D @playwright/test
npx playwright install chromium
```

**¿Qué es E2E?** *End-to-end*: Playwright abre un **navegador real**, visita la app compilada y
hace clic/escribe como un usuario. Detecta problemas que jsdom no ve (build roto, rutas mal
configuradas para producción, CSS que oculta botones, etc.).

> 🐧 En Linux, si falla por librerías faltantes: `npx playwright install --with-deps chromium`.

### 7.2 Configurar — `playwright.config.js`

```
testDir: './e2e',
use: { baseURL: 'http://localhost:4173' },
webServer: {
  command: 'npm run build && npm run preview -- --port 4173 --strictPort',
  url: 'http://localhost:4173',
},
```

Playwright compila y levanta la app antes de probar, tal como quedará en GitHub Pages. Además guarda
una captura por prueba y un video cuando una falla (evidencia para el informe).

### 7.3 Pruebas — carpeta `e2e/`

- `navegacion.spec.js`: título, menú con `HashRouter`, carga de regiones desde el build y página 404.
- `tienda.spec.js`: carrito que sobrevive a una recarga, búsqueda, **compra completa** (registro →
  inicio de sesión → pedido → el administrador lo despacha), stock crítico y RUN inválido.

```
npm run test:e2e        # modo consola
npm run test:e2e:ui     # interfaz visual: ves el navegador paso a paso (¡muy útil para aprender!)
```

Resultado esperado: `8 passed`.

> **Vitest vs. Playwright:** Vitest prueba piezas (funciones, componentes) en milisegundos;
> Playwright prueba la app completa en un navegador real, más lento pero más cercano al usuario.
> Se complementan.

### 7.4 ESLint y archivos de Node

`playwright.config.js` usa `process.env`, que existe en Node pero no en el navegador. En
`eslint.config.js` hay un bloque para que ESLint lo sepa:

```
{
  files: ['*.config.js', 'e2e/**/*.js'],
  languageOptions: { globals: globals.node },
},
```

`docs/legacy/` (la versión original en HTML + JS) está en los `globalIgnores`: se conserva solo como
referencia y no se revisa.

---

## Parte 8 · Preparar el proyecto para GitHub Pages

### 8.1 Rutas relativas — `vite.config.js`

```
base: './',
```

**¿Por qué?** GitHub Pages publica el sitio en `https://<usuario>.github.io/<nombre-repo>/` (una
subcarpeta). Por defecto Vite genera rutas absolutas como `/assets/index.js`, que apuntarían a
`https://<usuario>.github.io/assets/…` → **pantalla en blanco**. Con `base: './'` las rutas son
relativas y funcionan **sin importar cómo se llame el repositorio**. Esto es posible porque usamos
`HashRouter` (Parte 4.2).

### 8.2 Workflow de GitHub Actions — `.github/workflows/deploy.yml`

GitHub Actions es un servicio de **CI/CD**: ejecuta comandos en una máquina de GitHub cada vez que
haces `git push`. Nuestro workflow:

1. `npm ci` → instala dependencias exactamente como dice `package-lock.json`.
2. `npm run lint` → si hay errores de código, se detiene.
3. `npm run test:coverage` → pruebas Vitest + cobertura (falla si baja de los mínimos).
   El informe se guarda como artefacto `coverage`.
4. `npx playwright install --with-deps chromium` y `npm run test:e2e` → pruebas E2E.
   El informe HTML, las capturas y (si algo falla) videos y trazas se guardan en el artefacto
   `playwright-report`.
5. `npm run build` → genera `dist/`.
6. Sube `dist/` y lo **publica en GitHub Pages**.

Si **cualquier** paso falla, el sitio **no** se actualiza: nunca se publica código roto.

| Artefacto           | Contenido                                                                           | Cómo verlo                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `coverage`          | Informe de cobertura de Vitest                                                      | Descomprime y abre `index.html`.                                                                                                           |
| `playwright-report` | Informe HTML de Playwright, capturas de cada prueba y, si algo falló, video y traza | Descomprime y ejecuta `npx playwright show-report playwright-report`. Las trazas (`trace.zip`) se abren en <https://trace.playwright.dev>. |

Se suben **aunque las pruebas fallen** (`if: ${{ !cancelled() }}`) y se conservan **30 días**.

### 8.3 Probar el build localmente (recomendado antes de subir)

```
npm run build
npm run preview
```

Abre la URL que aparece (normalmente <http://localhost:4173>) y navega por todas las páginas.

---

## Parte 9 · Subir a GitHub y desplegar

### 9.1 Crear el repositorio en GitHub

1. Entra a <https://github.com/new>.
2. **Repository name:** por ejemplo `gasvolcan`.
3. Visibilidad **Public** (GitHub Pages gratis requiere repositorio público).
4. **No** marques "Add a README" ni `.gitignore` (ya los tenemos).
5. Clic en **Create repository**.

### 9.2 Inicializar Git y hacer el primer commit

```
git init                         # crea el repositorio local (carpeta oculta .git)
git branch -M main               # nombra la rama principal "main"
git add .                        # prepara todos los archivos (respeta .gitignore)
git commit -m "Proyecto inicial DSY1104: tienda GasVolcan"
```

### 9.3 Conectar con GitHub y subir

```
git remote add origin https://github.com/<tu-usuario>/gasvolcan.git
git push -u origin main
```

> 🔐 Si pide contraseña: GitHub ya **no acepta** la contraseña de la cuenta. Usa un *Personal Access
> Token* (Settings → Developer settings → Tokens) o inicia sesión con `gh auth login` / GitHub Desktop /
> VS Code.

### 9.4 Activar GitHub Pages (una sola vez)

1. En el repositorio: **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.

### 9.5 Ver el despliegue

1. Pestaña **Actions** del repositorio: verás el workflow "CI y despliegue a GitHub Pages".
   (Si se ejecutó antes de activar Pages y falló, entra al run y presiona **Re-run all jobs**.)
2. Cuando termine en verde ✅, el sitio queda en:

```
https://<tu-usuario>.github.io/gasvolcan/
```

Desde ahora, **cada `git push` a `main` vuelve a probar y publicar automáticamente**:

```
git add .
git commit -m "Describe tu cambio"
git push
```

### 9.6 Alternativa manual: paquete `gh-pages`

```
npm run deploy     # ejecuta "predeploy" (build) y sube dist/ a la rama gh-pages
```

Luego en **Settings → Pages → Source** elige **Deploy from a branch**, rama **gh-pages**, carpeta
**/ (root)**. Desventaja: no ejecuta las pruebas antes de publicar.

---

## Parte 10 · Problemas frecuentes

| Síntoma                                                            | Causa probable                                         | Solución                                                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `'npm' no se reconoce como comando`                                | Node no instalado o terminal abierta antes de instalar | Instala Node LTS y abre una terminal nueva.                                             |
| Pantalla en blanco en GitHub Pages                                 | Rutas absolutas en el build                            | Verifica `base: './'` en `vite.config.js`.                                              |
| 404 al recargar una página publicada                               | Uso de `BrowserRouter`                                 | Usa `HashRouter` (URLs con `#/`).                                                       |
| Las imágenes o las regiones no cargan en producción                | Rutas que empiezan con `/`                             | Usa rutas relativas (`img/gas-5kg.svg`) o `import.meta.env.BASE_URL`.                   |
| Workflow falla en "Deploy" con error de permisos                   | Pages no configurado                                   | Settings → Pages → Source: **GitHub Actions** y re-ejecuta el workflow.                 |
| `npm ci` falla en Actions                                          | `package-lock.json` no se subió o está desactualizado  | Ejecuta `npm install`, haz commit del lock y vuelve a subir.                            |
| Playwright: `Executable doesn't exist`                             | Falta el navegador                                     | `npx playwright install chromium`                                                       |
| Playwright: `port 4173 is already in use`                          | Quedó un `npm run preview` abierto                     | Ciérralo con Ctrl + C o reinicia la terminal.                                           |
| Los datos de la tienda "se resetean" o aparecen datos viejos       | Datos guardados en `localStorage` del navegador        | Borra los datos del sitio (F12 → Application → Local Storage) o sube la versión de la clave (`v1` → `v2`). |
| `Coverage for branches (…%) does not meet global threshold (80%)`  | La cobertura bajó del mínimo configurado               | Agrega pruebas para las líneas de *Uncovered Line #s* (o revisa `coverage/index.html`). |
| `Failed to load url @vitest/coverage-v8` / versiones incompatibles | Falta el paquete o no coincide con `vitest`            | `npm install -D @vitest/coverage-v8@<versión de vitest>`                                |
| ESLint: `'process' is not defined`                                 | Archivo de Node revisado con globals de navegador      | Revisa el bloque `globals.node` en `eslint.config.js`.                                  |

---

### Resumen de comandos usados para crear este proyecto

```
npm create vite@latest gasvolcan -- --template react-compiler --eslint --no-interactive
cd gasvolcan
npm install
npm install react-router
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @vitest/coverage-v8
npm install -D @playwright/test gh-pages
npx playwright install chromium
```

¡Éxito en DSY1104! 🌋
