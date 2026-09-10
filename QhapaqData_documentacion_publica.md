# QhapaqData — Public Technical Documentation
# QhapaqData — Documentación Técnica Pública

**Project:** QhapaqData — End-to-end cryptocurrency data and analytics platform.  
**Proyecto:** QhapaqData — Plataforma end-to-end de datos y análisis de criptomonedas.

---

## 1. Overview
## 1. Descripción general

QhapaqData is a personal portfolio project focused on data analytics, data engineering, APIs, databases, infrastructure, and web deployment.  
QhapaqData es un proyecto personal de portafolio enfocado en análisis de datos, ingeniería de datos, APIs, bases de datos, infraestructura y despliegue web.

The platform currently collects and stores cryptocurrency market data from CoinGecko and exposes it through a custom API and a public web application.  
La plataforma actualmente recolecta y almacena datos de mercado de criptomonedas desde CoinGecko y los expone mediante una API propia y una aplicación web pública.

The system captures approximately one Top 100 market snapshot every 5 minutes.  
El sistema captura aproximadamente un snapshot del Top 100 del mercado cada 5 minutos.

---

## 2. Live project
## 2. Proyecto en producción

**Frontend:** https://www.qhapaqdata.com  
**Frontend:** https://www.qhapaqdata.com

**Public API:** https://api.qhapaqdata.com  
**API pública:** https://api.qhapaqdata.com

Example endpoints:  
Endpoints de ejemplo:

```text
GET /health
GET /api/coins/latest
GET /api/coins/{coin_id}/history?days={days}
```

---

## 3. Architecture
## 3. Arquitectura

```text
CoinGecko API
      │
      ▼
Apache Airflow
      │
      ├──────────────► MinIO Data Lake
      │                 ├── Raw
      │                 ├── Silver
      │                 └── Gold
      │
      ▼
PostgreSQL
      │
      ▼
FastAPI
      │
      ▼
Cloudflare Tunnel
      │
      ▼
api.qhapaqdata.com
      │
      ▼
Next.js + TypeScript + Tailwind + ECharts
      │
      ▼
Vercel
      │
      ▼
www.qhapaqdata.com
```

The browser does not connect directly to PostgreSQL, MinIO, Airflow, or SSH.  
El navegador no se conecta directamente con PostgreSQL, MinIO, Airflow ni SSH.

Public data access is provided through FastAPI exposed using Cloudflare Tunnel.  
El acceso público a los datos se realiza mediante FastAPI expuesto usando Cloudflare Tunnel.

---

## 4. Technology stack
## 4. Tecnologías utilizadas

| Area | Technology |
|---|---|
| Data source | CoinGecko API |
| Orchestration | Apache Airflow |
| Data Lake | MinIO |
| Data formats | JSON, Parquet |
| Data processing | Python, pandas, pyarrow |
| Database | PostgreSQL |
| API | FastAPI, Uvicorn |
| Containers | Docker, Docker Compose |
| Private connectivity | Tailscale |
| Public API exposure | Cloudflare Tunnel |
| Frontend | Next.js |
| Frontend language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Apache ECharts |
| Version control | Git, GitHub |
| Frontend deployment | Vercel |
| Server OS | Ubuntu Server |

---


---

## 4.1 Role of each technology in the complete process
## 4.1 Rol de cada tecnología en el proceso completo

The following section explains how each major technology participates in the end-to-end workflow.  
La siguiente sección explica cómo participa cada tecnología principal dentro del flujo end-to-end.

### CoinGecko API

**Role:** external market data source.  
**Rol:** fuente externa de datos de mercado.

CoinGecko provides the cryptocurrency market data consumed by the ingestion pipeline, including identifiers, symbols, prices, market capitalization, volume, percentage changes, and image URLs.  
CoinGecko proporciona los datos de mercado de criptomonedas consumidos por el pipeline de ingesta, incluyendo identificadores, símbolos, precios, capitalización, volumen, variaciones porcentuales y URLs de imágenes.

```text
CoinGecko
   ↓
Market data
```

### Apache Airflow

**Role:** workflow orchestration and scheduling.  
**Rol:** orquestación y programación del flujo.

Airflow executes the cryptocurrency ingestion and transformation workflow on a schedule, currently approximately every 5 minutes.  
Airflow ejecuta el flujo de ingesta y transformación de criptomonedas de manera programada, actualmente aproximadamente cada 5 minutos.

It coordinates the steps that move data through Raw, Silver, Gold, and PostgreSQL.  
Coordina los pasos que mueven los datos a través de Raw, Silver, Gold y PostgreSQL.

```text
Schedule
   ↓
Airflow DAG
   ↓
Extraction → Transformation → Loading
```

### Python

**Role:** main backend data-processing language.  
**Rol:** lenguaje principal de procesamiento de datos en backend.

Python is used for API consumption, transformations, DataFrame operations, file generation, database loading, and FastAPI services.  
Python se utiliza para consumo de APIs, transformaciones, operaciones con DataFrames, generación de archivos, carga a base de datos y servicios FastAPI.

### pandas

**Role:** tabular data manipulation.  
**Rol:** manipulación de datos tabulares.

pandas is used to structure, clean, transform, and prepare cryptocurrency records before they move between medallion layers or into PostgreSQL.  
pandas se utiliza para estructurar, limpiar, transformar y preparar los registros de criptomonedas antes de moverlos entre capas medallion o cargarlos a PostgreSQL.

### PyArrow

**Role:** Parquet processing.  
**Rol:** procesamiento de Parquet.

PyArrow enables efficient creation and handling of Parquet files used in the Gold layer.  
PyArrow permite crear y manipular eficientemente archivos Parquet utilizados en la capa Gold.

### MinIO

**Role:** object storage and Data Lake.  
**Rol:** almacenamiento de objetos y Data Lake.

MinIO stores the different stages of the data pipeline using a simplified medallion architecture.  
MinIO almacena las diferentes etapas del pipeline mediante una arquitectura medallion simplificada.

```text
Raw
 ↓
Silver
 ↓
Gold
```

Raw preserves the original source data, Silver contains cleaned intermediate data, and Gold contains analytics-ready datasets.  
Raw conserva los datos originales, Silver contiene datos intermedios limpios y Gold contiene datasets listos para análisis.

### JSON

**Role:** source and intermediate exchange format.  
**Rol:** formato de intercambio de datos fuente e intermedio.

CoinGecko responses are initially stored as JSON because the format preserves the original API structure and fields.  
Las respuestas de CoinGecko se almacenan inicialmente como JSON porque el formato conserva la estructura y los campos originales de la API.

### Parquet

**Role:** efficient analytical storage format.  
**Rol:** formato eficiente de almacenamiento analítico.

Parquet is used in the Gold layer because it is columnar, compact, and suitable for analytical workloads.  
Parquet se utiliza en la capa Gold porque es columnar, compacto y adecuado para cargas analíticas.

### PostgreSQL

**Role:** historical relational database.  
**Rol:** base de datos relacional histórica.

PostgreSQL stores the historical cryptocurrency observations that are consumed by FastAPI.  
PostgreSQL almacena las observaciones históricas de criptomonedas que son consumidas por FastAPI.

It provides structured SQL access, primary keys, indexing, and UPSERT logic to maintain historical consistency.  
Proporciona acceso estructurado mediante SQL, claves primarias, índices y lógica UPSERT para mantener la consistencia histórica.

```text
Gold data
   ↓
PostgreSQL historical table
```

### psycopg2

**Role:** Python-to-PostgreSQL connectivity.  
**Rol:** conectividad entre Python y PostgreSQL.

The PostgreSQL driver allows Python services and pipeline tasks to insert, query, and update database records.  
El driver de PostgreSQL permite que los servicios Python y las tareas del pipeline inserten, consulten y actualicen registros.

### FastAPI

**Role:** backend service and API layer.  
**Rol:** servicio backend y capa API.

FastAPI exposes selected PostgreSQL data through HTTP endpoints.  
FastAPI expone datos seleccionados de PostgreSQL mediante endpoints HTTP.

This prevents the browser from directly accessing the database.  
Esto evita que el navegador acceda directamente a la base de datos.

```text
PostgreSQL
    ↓
FastAPI
    ↓
JSON API response
```

### Uvicorn

**Role:** ASGI application server.  
**Rol:** servidor de aplicaciones ASGI.

Uvicorn runs the FastAPI application inside the backend container.  
Uvicorn ejecuta la aplicación FastAPI dentro del contenedor backend.

### Docker

**Role:** service isolation and reproducible environments.  
**Rol:** aislamiento de servicios y entornos reproducibles.

Docker packages services such as Airflow, MinIO, PostgreSQL, and FastAPI into isolated containers.  
Docker empaqueta servicios como Airflow, MinIO, PostgreSQL y FastAPI en contenedores aislados.

This reduces dependency conflicts and makes the infrastructure easier to reproduce and maintain.  
Esto reduce conflictos de dependencias y facilita reproducir y mantener la infraestructura.

### Docker Compose

**Role:** multi-container service definition and coordination.  
**Rol:** definición y coordinación de múltiples contenedores.

Docker Compose defines how containers are started, configured, networked, and persisted.  
Docker Compose define cómo se inician, configuran, conectan y persisten los contenedores.

### Docker network

**Role:** private communication between backend services.  
**Rol:** comunicación privada entre servicios backend.

The shared Docker network allows containers to communicate using service names without exposing internal services directly to the public Internet.  
La red compartida de Docker permite que los contenedores se comuniquen usando nombres de servicio sin exponer directamente los servicios internos a Internet.

### Ubuntu Server

**Role:** host operating system.  
**Rol:** sistema operativo anfitrión.

Ubuntu Server runs the Docker engine, backend services, networking tools, and system services on the self-hosted mini PC.  
Ubuntu Server ejecuta Docker, los servicios backend, herramientas de red y servicios del sistema en la mini PC autoalojada.

### Tailscale

**Role:** private remote administration.  
**Rol:** administración remota privada.

Tailscale provides a private encrypted network used to access and administer the homeserver remotely without exposing SSH publicly.  
Tailscale proporciona una red privada cifrada para acceder y administrar remotamente el homeserver sin exponer SSH públicamente.

### Cloudflare DNS

**Role:** authoritative DNS management.  
**Rol:** administración DNS autoritativa.

Cloudflare manages the domain records required to route public traffic to the website and API.  
Cloudflare administra los registros DNS necesarios para dirigir el tráfico público hacia la web y la API.

### Cloudflare Tunnel

**Role:** secure public exposure of FastAPI.  
**Rol:** exposición pública segura de FastAPI.

Cloudflare Tunnel creates an outbound connection from the homeserver to Cloudflare, allowing the API to be published without opening inbound router ports.  
Cloudflare Tunnel crea una conexión saliente desde el homeserver hacia Cloudflare, permitiendo publicar la API sin abrir puertos entrantes en el router.

```text
FastAPI
   ↓
Cloudflare Tunnel
   ↓
api.qhapaqdata.com
```

### Next.js

**Role:** web application framework.  
**Rol:** framework de la aplicación web.

Next.js builds the public QhapaqData interface and consumes the FastAPI endpoints.  
Next.js construye la interfaz pública de QhapaqData y consume los endpoints de FastAPI.

It manages pages, routes, dynamic cryptocurrency pages, components, and frontend rendering.  
Gestiona páginas, rutas, páginas dinámicas de criptomonedas, componentes y renderizado frontend.

### TypeScript

**Role:** typed frontend development.  
**Rol:** desarrollo frontend tipado.

TypeScript improves maintainability and reduces errors by defining types for API responses, components, and frontend data structures.  
TypeScript mejora la mantenibilidad y reduce errores al definir tipos para respuestas de API, componentes y estructuras de datos frontend.

### Tailwind CSS

**Role:** frontend styling.  
**Rol:** estilos del frontend.

Tailwind CSS is used to build the layout, spacing, typography, responsive design, and visual styling of QhapaqData.  
Tailwind CSS se utiliza para construir el diseño, espaciado, tipografía, comportamiento responsive y estilos visuales de QhapaqData.

### Apache ECharts

**Role:** interactive data visualization.  
**Rol:** visualización interactiva de datos.

ECharts renders cryptocurrency charts and historical market visualizations in the frontend.  
ECharts renderiza gráficos de criptomonedas y visualizaciones históricas del mercado en el frontend.

### Cryptocurrency image map

**Role:** lightweight frontend metadata.  
**Rol:** metadatos ligeros del frontend.

The frontend currently associates CoinGecko image URLs with each cryptocurrency using `coin_id`.  
El frontend actualmente asocia URLs de imágenes de CoinGecko con cada criptomoneda usando `coin_id`.

This keeps visual resources in the frontend without modifying the historical database pipeline.  
Esto mantiene los recursos visuales en el frontend sin modificar el pipeline histórico de base de datos.

### Git

**Role:** local version control.  
**Rol:** control de versiones local.

Git records code changes, enables commits, allows rollback, and provides a structured history of project development.  
Git registra cambios en el código, permite commits, facilita revertir cambios y proporciona un historial estructurado del desarrollo.

Typical flow:  
Flujo típico:

```text
Modify code
   ↓
git status
   ↓
git add
   ↓
git commit
   ↓
git push
```

### GitHub

**Role:** remote source-code repository and project portfolio.  
**Rol:** repositorio remoto de código fuente y portafolio del proyecto.

GitHub stores the project repository, documentation, source code, commit history, and public project information.  
GitHub almacena el repositorio, documentación, código fuente, historial de commits e información pública del proyecto.

It also acts as the source repository connected to Vercel.  
También funciona como repositorio fuente conectado a Vercel.

```text
Local Git
   ↓
GitHub repository
```

### Codex

**Role:** coding assistant during frontend development and maintenance.  
**Rol:** asistente de programación durante el desarrollo y mantenimiento del frontend.

Codex is used to inspect the project, implement requested code changes, integrate frontend features, and verify builds.  
Codex se utiliza para inspeccionar el proyecto, implementar cambios solicitados, integrar funcionalidades frontend y verificar builds.

Changes are still reviewed and versioned through Git before deployment.  
Los cambios continúan siendo revisados y versionados mediante Git antes del despliegue.

### npm

**Role:** JavaScript/TypeScript dependency and build management.  
**Rol:** gestión de dependencias y builds de JavaScript/TypeScript.

npm installs frontend dependencies and executes project scripts such as:  
npm instala dependencias frontend y ejecuta scripts del proyecto como:

```bash
npm install
npm run build
npm run dev
```

`npm run build` is used before deployment to detect compilation or TypeScript errors.  
`npm run build` se utiliza antes del despliegue para detectar errores de compilación o TypeScript.

### Vercel

**Role:** frontend build and production deployment platform.  
**Rol:** plataforma de build y despliegue del frontend en producción.

Vercel is connected to the GitHub repository and automatically creates a new deployment when changes are pushed to the production branch.  
Vercel está conectado al repositorio de GitHub y crea automáticamente un nuevo despliegue cuando se envían cambios a la rama de producción.

```text
GitHub main
    ↓
Vercel detects push
    ↓
Build Next.js
    ↓
Deploy
    ↓
www.qhapaqdata.com
```

This makes the frontend deployment process largely automatic.  
Esto hace que el proceso de despliegue frontend sea en gran medida automático.

---

## 4.2 Complete end-to-end process
## 4.2 Proceso end-to-end completo

The complete current workflow can be summarized as follows:  
El flujo completo actual puede resumirse de la siguiente manera:

```text
1. CoinGecko API
      ↓
   Provides Top 100 cryptocurrency market data.

2. Apache Airflow
      ↓
   Runs the ingestion pipeline every ~5 minutes.

3. Python + pandas
      ↓
   Processes and structures the received records.

4. MinIO
      ↓
   Stores Raw → Silver → Gold datasets.

5. PyArrow / Parquet
      ↓
   Creates compact analytics-ready Gold files.

6. PostgreSQL
      ↓
   Stores historical market observations.

7. FastAPI + Uvicorn
      ↓
   Exposes selected historical and latest data.

8. Cloudflare Tunnel
      ↓
   Publishes FastAPI securely as api.qhapaqdata.com.

9. Next.js + TypeScript
      ↓
   Consumes the API and builds the user interface.

10. Tailwind CSS
       ↓
    Provides layout and visual styling.

11. Apache ECharts
       ↓
    Displays interactive market and historical charts.

12. coinImages.ts
       ↓
    Associates cryptocurrency logos using coin_id.

13. Git
       ↓
    Tracks and commits frontend/source changes.

14. GitHub
       ↓
    Stores the remote repository and documentation.

15. Vercel
       ↓
    Detects pushes to main, builds Next.js and deploys.

16. qhapaqdata.com
       ↓
    End user accesses the production application.
```

In parallel, Docker and Docker Compose provide the execution environment for backend services, Ubuntu Server acts as the host system, Tailscale provides private administration, and Cloudflare manages DNS and secure public API connectivity.  
En paralelo, Docker y Docker Compose proporcionan el entorno de ejecución de los servicios backend, Ubuntu Server actúa como sistema anfitrión, Tailscale proporciona administración privada y Cloudflare administra DNS y conectividad pública segura de la API.


## 5. Data pipeline
## 5. Pipeline de datos

The ingestion pipeline retrieves market information for approximately the Top 100 cryptocurrencies by market capitalization.  
El pipeline de ingesta obtiene información de mercado de aproximadamente las 100 principales criptomonedas por capitalización.

Current execution frequency:  
Frecuencia actual de ejecución:

```text
Every 5 minutes
```

Approximate data volume:  
Volumen aproximado de datos:

```text
12 snapshots/hour
100 cryptocurrencies/snapshot
1,200 rows/hour
28,800 rows/day
~864,000 rows/month
~10.5 million rows/year
```

---

## 6. Medallion architecture
## 6. Arquitectura Medallion

The MinIO Data Lake follows a simplified medallion architecture.  
El Data Lake en MinIO sigue una arquitectura medallion simplificada.

```text
Raw → Silver → Gold
```

### Raw

The Raw layer preserves the original CoinGecko response in JSON format.  
La capa Raw conserva la respuesta original de CoinGecko en formato JSON.

Typical fields include:  
Los campos típicos incluyen:

```text
id
symbol
name
image
current_price
market_cap
market_cap_rank
total_volume
price_change_percentage_24h
circulating_supply
total_supply
max_supply
ath
atl
last_updated
```

### Silver

The Silver layer contains cleaned and structured intermediate data.  
La capa Silver contiene datos intermedios limpios y estructurados.

### Gold

The Gold layer contains analytics-ready data, primarily stored as Parquet.  
La capa Gold contiene datos preparados para análisis, almacenados principalmente en Parquet.

---

## 7. PostgreSQL historical storage
## 7. Almacenamiento histórico en PostgreSQL

The main historical table is:  
La tabla histórica principal es:

```text
public.coingecko_top100_history
```

Main fields:  
Campos principales:

```text
extraction_time
coin_id
symbol
name
market_cap_rank
current_price
market_cap
total_volume
price_change_percentage_24h
source_parquet
loaded_at
```

The primary key is based on:  
La clave primaria se basa en:

```text
(extraction_time, coin_id)
```

UPSERT logic is used to avoid duplicate historical records.  
Se utiliza lógica UPSERT para evitar registros históricos duplicados.

---

## 8. FastAPI
## 8. FastAPI

FastAPI acts as the service layer between PostgreSQL and the frontend.  
FastAPI actúa como capa de servicio entre PostgreSQL y el frontend.

Main dependencies:  
Dependencias principales:

```text
fastapi
uvicorn[standard]
psycopg2-binary
```

### Health endpoint

```text
GET /health
```

Expected response:  
Respuesta esperada:

```json
{
  "status": "ok",
  "service": "qhapaqdata-api"
}
```

### Latest market snapshot

```text
GET /api/coins/latest
```

This endpoint returns the latest complete market snapshot.  
Este endpoint devuelve el último snapshot completo del mercado.

The query is designed to avoid mixing rows from different extraction timestamps.  
La consulta está diseñada para evitar mezclar filas de diferentes tiempos de extracción.

### Historical data

```text
GET /api/coins/{coin_id}/history?days={days}
```

Current supported range:  
Rango soportado actualmente:

```text
1 to 365 days
```

Frontend mapping:  
Mapeo utilizado por el frontend:

```text
1D → 1
5D → 5
1M → 30
6M → 180
1Y → 365
```

---

## 9. Frontend
## 9. Frontend

The frontend is built with:  
El frontend está construido con:

```text
Next.js
TypeScript
Tailwind CSS
Apache ECharts
```

Main navigation:  
Navegación principal:

```text
Home
Crypto
Analytics
Statistics
ML
Projects
About
View CV
```

The `/crypto` page consumes real data from the public API.  
La página `/crypto` consume datos reales desde la API pública.

Main components include:  
Los principales componentes incluyen:

```text
Latest market snapshot
Last updated
Top Gainer
Top Loser
Highest Volume
Largest Market Cap
Top 100 table
Search
Sorting
```

---

## 10. Cryptocurrency detail page
## 10. Página de detalle de criptomonedas

Dynamic route:  
Ruta dinámica:

```text
/crypto/[coin]
```

Example:  
Ejemplo:

```text
/crypto/bitcoin
```

The page includes current market information and historical charts.  
La página incluye información actual del mercado y gráficos históricos.

Planned or available analysis sections include:  
Las secciones de análisis previstas o disponibles incluyen:

```text
Overview
Statistics
Risk
Correlation
Models
```

---

## 11. Cryptocurrency logos
## 11. Logos de criptomonedas

CoinGecko already provides image URLs in the Raw dataset.  
CoinGecko ya proporciona URLs de imágenes en los datos Raw.

For the current frontend implementation, cryptocurrency logos are resolved by `coin_id`.  
Para la implementación actual del frontend, los logos se resuelven mediante `coin_id`.

Example:  
Ejemplo:

```text
coin.coin_id = "bitcoin"
        ↓
coinImages["bitcoin"]
        ↓
Bitcoin logo URL
```

The association is never based on market rank or array position.  
La asociación nunca se basa en el ranking de mercado ni en la posición del array.

This ensures the correct logo remains associated even if rankings change.  
Esto garantiza que el logo correcto permanezca asociado aunque cambie el ranking.

A future improvement is to store cryptocurrency metadata in a dedicated table such as:  
Una mejora futura es almacenar los metadatos de criptomonedas en una tabla dedicada como:

```text
crypto_assets
-------------
coin_id
symbol
name
image
```

---

## 12. Deployment workflow
## 12. Flujo de despliegue

The frontend deployment workflow is:  
El flujo de despliegue del frontend es:

```text
Local development
      ↓
Git
      ↓
GitHub
      ↓
Vercel
      ↓
www.qhapaqdata.com
```

The production branch is:  
La rama de producción es:

```text
main
```

A push to `main` triggers a new Vercel deployment automatically.  
Un push a `main` activa automáticamente un nuevo deployment en Vercel.

Typical workflow:  
Flujo típico:

```bash
git status
git add .
git commit -m "Describe the change"
git push origin main
```

Sensitive files such as `.env`, tokens, credentials, certificates, and private keys must never be committed.  
Los archivos sensibles como `.env`, tokens, credenciales, certificados y claves privadas nunca deben subirse al repositorio.

---

## 13. Infrastructure and security
## 13. Infraestructura y seguridad

The backend runs on a self-hosted Ubuntu Server machine using Docker.  
El backend se ejecuta en un servidor propio con Ubuntu Server utilizando Docker.

Services communicate through a private Docker network.  
Los servicios se comunican mediante una red privada de Docker.

PostgreSQL, MinIO, Airflow, and SSH are not intended to be publicly exposed.  
PostgreSQL, MinIO, Airflow y SSH no están destinados a exponerse públicamente.

FastAPI is exposed publicly through Cloudflare Tunnel.  
FastAPI se expone públicamente mediante Cloudflare Tunnel.

Tailscale is used for private remote administration.  
Tailscale se utiliza para administración remota privada.

Standard internal ports may be used by services, but direct public access is restricted.  
Los servicios pueden utilizar puertos internos estándar, pero el acceso público directo está restringido.

---

## 14. Data continuity
## 14. Continuidad de datos

Existing data is preserved if the homeserver is turned off.  
Los datos existentes se conservan si el homeserver se apaga.

However, no new snapshots are captured while the server is offline.  
Sin embargo, no se capturan nuevos snapshots mientras el servidor está apagado.

For example:  
Por ejemplo:

```text
3 hours offline
× 12 snapshots/hour
= ~36 missed snapshots
```

The impact is therefore a gap in the time series, not the loss of previously stored history.  
El impacto es, por lo tanto, un hueco en la serie temporal y no la pérdida del histórico previamente almacenado.

---

## 15. Storage growth
## 15. Crecimiento del almacenamiento

The current data growth rate is modest relative to the available storage capacity.  
La tasa actual de crecimiento de datos es baja en relación con la capacidad de almacenamiento disponible.

An early PostgreSQL estimate indicated approximately:  
Una estimación inicial de PostgreSQL indicó aproximadamente:

```text
~7 MB/day
~212 MB/month
~2.6 GB/year
```

This estimate is preliminary and should be validated using measurements separated by 24 hours or more.  
Esta estimación es preliminar y debe validarse mediante mediciones separadas por 24 horas o más.

The MinIO Data Lake also remains small relative to available storage.  
El Data Lake en MinIO también permanece pequeño en relación con el almacenamiento disponible.

---

## 16. Reliability
## 16. Confiabilidad

Docker services are intended to use automatic restart policies such as:  
Los servicios Docker están pensados para usar políticas de reinicio automático como:

```text
unless-stopped
```

Cloudflare Tunnel runs as a system service and can start automatically after reboot.  
Cloudflare Tunnel se ejecuta como servicio del sistema y puede iniciar automáticamente después de un reinicio.

---

## 17. Future analytics
## 17. Analítica futura

The historical dataset enables several future analysis modules.  
El histórico permite desarrollar varios módulos futuros de análisis.

### Statistics

Potential additions include:  
Posibles incorporaciones:

```text
Descriptive statistics
Returns
Volatility
Distributions
Correlation
Risk metrics
Rolling statistics
```

### Machine Learning

Potential projects include:  
Posibles proyectos:

```text
Regression
Classification
Clustering
PCA
Feature engineering
Model comparison
```

### Deep Learning

A natural extension is cryptocurrency time-series modeling using:  
Una extensión natural es modelar series temporales de criptomonedas utilizando:

```text
RNN
LSTM
GRU
```

Models can be trained externally on GPU hardware and later served through FastAPI.  
Los modelos pueden entrenarse externamente en hardware con GPU y posteriormente desplegarse mediante FastAPI.

---

## 18. Project value
## 18. Valor del proyecto

QhapaqData is designed to demonstrate more than a frontend dashboard.  
QhapaqData está diseñado para demostrar más que un dashboard frontend.

The full workflow is:  
El flujo completo es:

```text
Public API
→ ingestion
→ orchestration
→ Data Lake
→ transformation
→ historical database
→ custom API
→ infrastructure
→ frontend
→ visualization
→ analytics
```

This makes the project relevant to roles such as:  
Esto hace que el proyecto sea relevante para perfiles como:

```text
Data Analyst
Data Scientist
Data Engineer
Analytics Engineer
Machine Learning / AI
```

---

## 19. Current project status
## 19. Estado actual del proyecto

```text
[OK] CoinGecko ingestion
[OK] Airflow scheduled pipeline
[OK] MinIO Raw / Silver / Gold
[OK] PostgreSQL historical storage
[OK] FastAPI
[OK] Health endpoint
[OK] Latest market endpoint
[OK] Historical endpoint
[OK] Cloudflare Tunnel
[OK] Public API
[OK] Next.js frontend
[OK] GitHub repository
[OK] Vercel automatic deployment
[OK] Real Top 100 market data
[OK] Real historical charts
[OK] Cryptocurrency logos
```

The system currently operates as a publicly accessible end-to-end data application powered by a self-hosted backend.  
El sistema funciona actualmente como una aplicación de datos end-to-end accesible públicamente y alimentada por un backend autoalojado.

---

## 20. Security note for this repository
## 20. Nota de seguridad para este repositorio

This public documentation intentionally excludes:  
Esta documentación pública excluye intencionalmente:

```text
Passwords
API tokens
Private IP addresses
Tailscale IP addresses
Cloudflare Tunnel IDs
Private certificates
SSH keys
.env contents
Local personal paths
Database passwords
Private VPS addresses
```

Only architecture and non-sensitive implementation details are documented publicly.  
Solo se documentan públicamente la arquitectura y los detalles de implementación no sensibles.
