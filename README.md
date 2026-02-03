# 🌟 Just Good News - Backend

El corazón inteligente de **Just Good News**: un servidor que **busca, filtra y almacena noticias positivas** automáticamente para que el mundo tenga acceso a historias que importan.

## 🤖 ¿Cómo Funciona?

El backend de Just Good News es un **sistema de procesamiento de noticias completamente automatizado**:

1. **🔍 Búsqueda continua**: Cada 30 minutos, el servidor se conecta a fuentes RSS confiables (como Clarín) y descarga las últimas noticias
2. **🧠 Filtrado inteligente**: Utiliza análisis de palabras clave para identificar noticias negativas y las descarta automáticamente
3. 💾 **Almacenamiento**: Las noticias positivas se guardan en una base de datos PostgreSQL segura y confiable
4. 🌐 **API para el frontend**: Expone endpoints REST que permiten que la aplicación web acceda a todas las noticias de forma rápida y eficiente

## 💡 La Magia del Filtrado

El sistema implementa un **filtro de sentimiento basado en inteligencia de palabras clave**:

- **Palabras negativas rechazadas**: crimen, muerte, asesinato, violencia, tragedia, accidente, guerra, etc.
- **Palabras positivas aceptadas**: avance, descubrimiento, innovación, tecnología, ciencia, mejora, logro, éxito, etc.
- **Resultado**: Solo las noticias verdaderamente positivas alcanzan a los usuarios

## 🏗️ Arquitectura

```
Fuentes RSS (Clarín)
        ↓
   [Servidor Node.js]
        ↓
   [Fetch Service] → Descarga el RSS
        ↓
   [Filter Service] → Analiza sentimiento
        ↓
   [Database] → Almacena noticias únicas
        ↓
   [API REST] → Sirve datos al frontend
```

## 🔌 Endpoints Disponibles

El backend expone una **API REST limpia y eficiente**:

- `GET /api/news` - Feed de noticias paginadas
- `GET /api/news/:id` - Detalle de una noticia específica  
- `GET /api/news/categoria/:categoria` - Noticias filtradas por categoría

Cada respuesta incluye: título, descripción, fuente, URL original, fecha, categoría y sentimiento.

## 🚀 Requisitos

- Node.js 18+
- npm o yarn
- PostgreSQL 12+ (o Supabase)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JulianGarbate/just-good-news-backend.git
cd just-good-news-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/just_good_news"
DIRECT_URL="postgresql://user:password@localhost:5432/just_good_news"
PORT=4000
EOF

# Crear la base de datos y ejecutar migraciones
npx prisma migrate deploy

# Iniciar en desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

## 🏗️ Estructura del Proyecto

```
src/
├── index.ts                # Punto de entrada, configuración del servidor
├── prisma.ts              # Cliente de Prisma
├── controllers/
│   └── news.controllers.ts # Lógica de endpoints
├── routes/
│   └── news.routes.ts     # Definición de rutas
├── services/
│   ├── fetch.services.ts  # Obtención de RSS
│   ├── filtro.services.ts # Filtrado de noticias
│   └── news.services.ts   # Lógica de noticias
└── cron/
    └── news.cron.ts       # Tarea programada

prisma/
├── schema.prisma          # Esquema de BD
└── migrations/            # Historial de cambios
```

## 📡 API Endpoints

### GET `/api/news?page=1&limit=6`
Obtiene noticias paginadas

**Respuesta:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "Noticia positiva",
      "subtitle": "Descripción",
      "imageUrl": "https://...",
      "source": "Clarín",
      "originalUrl": "https://...",
      "category": "general",
      "sentiment": "positive",
      "publishedAt": "2026-02-03T10:30:00Z"
    }
  ],
  "hasMore": true,
  "total": 42,
  "page": 1,
  "limit": 6
}
```

### GET `/api/news/:id`
Obtiene detalle de una noticia

### GET `/api/news/categoria/:categoria`
Obtiene noticias filtradas por categoría

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/just_good_news"
DIRECT_URL="postgresql://user:password@localhost:5432/just_good_news"

# Servidor
PORT=4000
NODE_ENV=development
```

### Supabase (alternativa a PostgreSQL local)

```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

## 🛠️ Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Iniciar servidor compilado
npm start

# Abrir Prisma Studio (UI para BD)
npm run prisma:studio

# Ver estado de migraciones
npx prisma migrate status
```

## 🤖 Cron Job - Recopilación de Noticias

El servidor ejecuta automáticamente cada **30 minutos**:

```
🚀 Ejecutando búsqueda inicial de noticias...
📡 Fetcheando noticias de Clarín: https://www.clarin.com/rss/lo-ultimo/
✅ 10 items obtenidos del feed
📰 Filtrando 10 noticias...
🔬 Filtrando 10 noticias con palabras clave...
✨ 8 noticias pasaron el filtro
💾 8 noticias guardadas en BD
```

### Schedule

El cron está configurado con `"*/30 * * * *"` (cada 30 minutos)

Para cambiar la frecuencia, edita [src/index.ts](src/index.ts):

```typescript
startNewsCron("0 * * * *", url, sourceName); // Cada hora
startNewsCron("0 0 * * *", url, sourceName); // Diariamente
startNewsCron("*/5 * * * *", url, sourceName); // Cada 5 minutos
```

## 📊 Base de Datos

### Modelo News

```prisma
model News {
  id           Int      @id @default(autoincrement())
  title        String
  subtitle     String?
  imageUrl     String?
  source       String
  originalUrl  String   @unique
  category     String
  sentiment    String   // "positive" | "negative"
  publishedAt  DateTime
  createdAt    DateTime @default(now())
}
```

## 🔍 Lógica de Filtrado

Las noticias se filtran según:

**Se DESCARTAN si contienen estas palabras:**
- murió, muerte, asesin, crimen, violencia, ataque, tragedia, accidente, choque, herido, guerra, conflicto

**Se ACEPTAN si:**
- No tienen palabras negativas

## 🐛 Troubleshooting

### "Error de conexión a BD"
```bash
# Verifica las variables de entorno
cat .env

# Prueba la conexión
npx prisma db execute --stdin < /dev/null
```

### "Las migraciones fallaron"
```bash
# Resuelve la migración fallida
npx prisma migrate resolve --rolled-back 20260203050134_init

# Resetea la BD (⚠️ borra todos los datos)
npx prisma migrate reset
```

### "No se obtienen noticias del RSS"
```bash
# Revisa los logs en tiempo real
npm run dev

# Verifica que la URL del RSS sea accesible
curl https://www.clarin.com/rss/lo-ultimo/
```

### "Puerto 4000 ya está en uso"
```bash
# Cambia el puerto en .env
PORT=5000

# O libera el puerto
# Windows: netstat -ano | findstr :4000
# Mac/Linux: lsof -i :4000
```

## 📚 Dependencias Principales

- **express**: Framework web
- **@prisma/client**: ORM para BD
- **node-cron**: Tareas programadas
- **rss-parser**: Parse de feeds RSS
- **typescript**: Tipado estático
- **dotenv**: Variables de entorno

## 🚀 Deployment

### Vercel (función serverless)
```bash
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Railway / Render / Heroku
1. Conecta tu repositorio GitHub
2. Configura las variables de entorno
3. Deploy automático en cada push

## 📈 Monitoreo

Para ver logs en tiempo real:

```bash
npm run dev

# Output esperado:
✅ Cron iniciado con schedule: */30 * * * *
Server running on port 4000
🚀 Ejecutando búsqueda inicial de noticias...
📡 Fetcheando noticias de Clarín...
✅ Items obtenidos del feed
💾 Noticias guardadas en BD
🔎 GET /news - página 1, límite 6
📊 Total de noticias en BD: 42
✅ Enviando 6 noticias
```

## 👨‍💻 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-fuente`)
3. Commit los cambios (`git commit -m 'Agregar fuente de noticias'`)
4. Push (`git push origin feature/nueva-fuente`)
5. Abre un Pull Request

### Ideas de mejora
- [ ] Agregar más fuentes de RSS
- [ ] Análisis de sentimientos con IA
- [ ] Sistema de categorización automático
- [ ] Caché Redis para optimizar
- [ ] Webhooks para actualizaciones en tiempo real

## 📄 Licencia

Este proyecto está bajo la licencia ISC.

## 📧 Contacto

**Autor**: Julian Garbate  
**GitHub**: [@JulianGarbate](https://github.com/JulianGarbate)  
**Backend Repo**: [just-good-news-backend](https://github.com/JulianGarbate/just-good-news-backend)

---

Hecho con ❤️ para difundir buenas noticias
