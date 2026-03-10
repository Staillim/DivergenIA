# Propuesta: Plataforma Digital para Gestión de Investigación del Semillero DivergenIA

## Resumen Ejecutivo

Desarrollo de una plataforma web tipo campus virtual que permita gestionar proyectos, ideas, avances y recursos del semillero en un entorno centralizado, incorporando herramientas colaborativas y asistentes basados en inteligencia artificial.

---

## 1. Concepto General

Crear una plataforma web privada para el semillero, donde los miembros puedan:

- ✅ Subir ideas de proyectos
- ✅ Compartir diapositivas
- ✅ Registrar avances
- ✅ Documentar investigaciones
- ✅ Ver el estado de cada proyecto
- ✅ Colaborar con otros miembros

**Visión:** Funcionar como un mini campus virtual del semillero, donde la investigación, colaboración y documentación se centralicen en un único espacio digital.

**Alcance público:** Los visitantes también podrían ver algunas secciones públicas para conocer el trabajo del grupo y promover la transparencia investigativa.

---

## 2. Tipos de Usuarios

### 👁️ Visitante

**No necesita cuenta.**

**Permisos:**
- Ver información del semillero
- Ver proyectos públicos
- Ver presentaciones o resultados finales
- Solicitar unirse al semillero

### 👤 Miembro

**Usuarios registrados del semillero.**

**Permisos:**
- Subir ideas de proyectos
- Crear proyectos
- Subir avances
- Subir documentos o diapositivas
- Ver proyectos internos
- Comentar avances
- Participar en votaciones de ideas
- Actualizar su perfil profesional

### 👨‍💼 Administrador

**Normalmente el líder o coordinador del semillero.**

**Permisos:**
- Aprobar miembros nuevos
- Aprobar ideas de proyectos
- Gestionar usuarios y permisos
- Cambiar estados de proyectos
- Moderar contenido
- Generar reportes de actividad
- Configurar parámetros de la plataforma

---

## 3. Secciones Principales de la Plataforma

### 🏠 Inicio

**Página pública del semillero.**

**Contenido:**
- Qué es DivergenIA
- Misión y visión
- Líneas de investigación
- Proyectos destacados
- Equipo coordinador
- Botón de iniciar sesión
- Botón de registrarse
- Formulario de contacto

---

### 📊 Proyectos

**Repositorio de todos los proyectos del semillero.**

Cada proyecto incluye:

| Campo | Descripción |
|-------|-------------|
| **Título** | Nombre del proyecto |
| **Descripción** | Resumen ejecutivo del proyecto |
| **Integrantes** | Lista de miembros participantes con sus roles |
| **Estado** | Fase actual del proyecto |
| **Avances** | Bitácora de progreso |
| **Documentos** | Archivos relacionados |
| **Presentaciones** | Slides y materiales de exposición |
| **Fecha de inicio** | Timestamp de creación |
| **Fecha estimada de finalización** | Planning temporal |

**Estados posibles:**

```
📝 Idea           → Concepto inicial sin aprobación
🔨 En desarrollo  → Proyecto aprobado en construcción
🔬 En investigación → Fase de análisis y experimentación
🧪 En pruebas     → Validación y testing
✅ Finalizado     → Proyecto completado
🚫 Cancelado      → Proyecto descontinuado
⏸️ En pausa       → Temporalmente inactivo
```

---

### 💡 Banco de Ideas

**Lugar donde los miembros publican propuestas de proyectos.**

**Ejemplo de idea:**

```markdown
### Idea: IA para detectar plagio en trabajos académicos

**Descripción:**
Sistema basado en inteligencia artificial que analice documentos 
académicos y detecte similitudes con fuentes existentes, proporcionando 
un reporte de originalidad detallado.

**Autor:** Juan Pérez
**Fecha:** 10 de marzo de 2026
**Votos a favor:** 12
**Votos en contra:** 2
**Estado:** En votación
```

**Estados de ideas:**
- 🗳️ En votación
- ✅ Aprobada
- ❌ Rechazada
- 🔄 Requiere modificaciones

**Funcionalidades:**
- Los miembros pueden votar (+1/-1)
- Comentar con sugerencias
- Proponer mejoras
- Fusionar ideas similares
- Ver historial de votaciones

---

### 📈 Avances de Proyectos

**Bitácora de cada proyecto con registro cronológico.**

**Ejemplo:**

```markdown
## Proyecto: IA para predicción de trading

### Avance 1
📅 Fecha: 10 de marzo de 2026
👤 Autor: María González
📝 Descripción: Se creó el modelo inicial basado en redes neuronales LSTM.
📎 Archivos adjuntos: modelo_v1.py

### Avance 2
📅 Fecha: 20 de marzo de 2026
👤 Autor: Carlos Ramírez
📝 Descripción: Se entrenó el modelo con dataset histórico de 5 años.
📊 Métricas: Accuracy 78%, Loss 0.32
📎 Archivos adjuntos: training_results.csv
```

**Información de cada avance:**
- Fecha y hora
- Autor del avance
- Descripción detallada
- Archivos adjuntos (código, datos, gráficos)
- Métricas o resultados
- Próximos pasos
- Comentarios del equipo

---

### 📚 Biblioteca

**Repositorio centralizado de archivos del semillero.**

**Tipos de archivos admitidos:**
- 📊 Diapositivas (PPT, PPTX, PDF)
- 📄 Papers y artículos científicos
- 💾 Datasets (CSV, JSON, SQL)
- 💻 Códigos fuente (Python, JavaScript, etc.)
- 📑 Informes y documentos técnicos
- 🎥 Videos y grabaciones
- 🖼️ Imágenes y diagramas

**Funcionalidades:**
- Búsqueda por palabras clave
- Filtros por tipo, proyecto, autor, fecha
- Vista previa de documentos
- Sistema de etiquetas (tags)
- Versionado de archivos
- Control de acceso (público/privado)
- Estadísticas de descargas

---

### 👥 Miembros del Semillero

**Directorio de integrantes con perfiles profesionales.**

**Información de cada perfil:**
- 📸 Foto de perfil
- 👤 Nombre completo
- 🎓 Carrera
- 📅 Semestre
- 📧 Correo electrónico (opcional)
- 💼 Proyectos en los que participa
- 🛠️ Habilidades técnicas (Python, Machine Learning, etc.)
- 🏆 Logros en el semillero
- 🔗 Enlaces a LinkedIn/GitHub
- 📅 Fecha de ingreso

---

## 4. Panel del Usuario (Dashboard)

Cuando un miembro inicia sesión verá:

```
╔══════════════════════════════════════════════════╗
║           Dashboard - Bienvenido, Juan           ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📊 Proyectos en los que participo               ║
║  ├─ IA para predicción de trading                ║
║  ├─ Chatbot educativo con NLP                    ║
║  └─ Sistema de recomendación                     ║
║                                                  ║
║  📝 Últimos avances                              ║
║  ├─ [20/03] Modelo LSTM entrenado - Trading      ║
║  └─ [18/03] Dataset limpio - Chatbot             ║
║                                                  ║
║  💡 Nuevas ideas publicadas                      ║
║  ├─ IA para detectar plagio                      ║
║  └─ Asistente virtual para programación          ║
║                                                  ║
║  🔔 Actividad del semillero                      ║
║  ├─ 3 nuevos comentarios en tus proyectos        ║
║  └─ Reunión general: 25/03 - 3:00 PM             ║
║                                                  ║
║  📁 Archivos recientes                           ║
║  ├─ presentacion_final.pdf                       ║
║  └─ dataset_clean.csv                            ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

**Widgets del dashboard:**
- Resumen de actividad personal
- Notificaciones importantes
- Calendario de eventos
- Tareas pendientes
- Gráficos de progreso
- Accesos rápidos

---

## 5. Equipos de Trabajo para Proyectos

### 🎯 Estructura de Equipos

Cada proyecto debe contar con una estructura organizacional clara que defina roles y responsabilidades:

#### Roles Principales

##### 🎓 Líder de Proyecto (Project Lead)

**Responsabilidades:**
- Coordinar al equipo y gestionar el proyecto
- Definir objetivos y alcance
- Distribuir tareas entre miembros
- Supervisar el cumplimiento de plazos
- Comunicación con stakeholders
- Resolver conflictos internos
- Presentar avances al semillero

**Habilidades requeridas:**
- Liderazgo y comunicación
- Gestión de proyectos
- Visión estratégica

---

##### 🔬 Investigador Principal (Research Lead)

**Responsabilidades:**
- Diseñar la metodología de investigación
- Revisar literatura científica relacionada
- Validar hipótesis y experimentos
- Garantizar rigor científico
- Redactar papers y documentos técnicos
- Asesorar en decisiones técnicas

**Habilidades requeridas:**
- Conocimiento del estado del arte
- Pensamiento crítico
- Escritura académica

---

##### 💻 Desarrollador/Implementador (Developer)

**Responsabilidades:**
- Programar soluciones técnicas
- Implementar modelos de IA/ML
- Optimizar código y algoritmos
- Realizar pruebas unitarias
- Documentar código
- Mantener repositorios (Git)

**Habilidades requeridas:**
- Programación (Python, JavaScript, etc.)
- Frameworks de ML (TensorFlow, PyTorch)
- Control de versiones (Git)

---

##### 📊 Analista de Datos (Data Analyst)

**Responsabilidades:**
- Recolección y limpieza de datos
- Análisis exploratorio (EDA)
- Visualización de datos
- Preparación de datasets
- Validación de calidad de datos
- Generar insights estadísticos

**Habilidades requeridas:**
- Estadística y probabilidad
- Pandas, NumPy, SQL
- Visualización (Matplotlib, Seaborn, Power BI)

---

##### 🎨 Diseñador UI/UX (si aplica)

**Responsabilidades:**
- Diseñar interfaces de usuario
- Crear wireframes y mockups
- Garantizar experiencia de usuario óptima
- Prototipar soluciones
- Realizar pruebas de usabilidad

**Habilidades requeridas:**
- Figma, Adobe XD
- Principios de diseño
- Empatía con usuarios

---

##### 📝 Documentador/Gestor de Conocimiento

**Responsabilidades:**
- Mantener documentación actualizada
- Redactar informes técnicos
- Crear presentaciones
- Gestionar la biblioteca del proyecto
- Asegurar trazabilidad de decisiones
- Preparar material para publicaciones

**Habilidades requeridas:**
- Redacción técnica
- Organización
- Markdown, LaTeX

---

##### 🧪 Tester/QA (Quality Assurance)

**Responsabilidades:**
- Diseñar casos de prueba
- Ejecutar pruebas funcionales
- Validar resultados experimentales
- Reportar bugs y mejoras
- Verificar reproducibilidad
- Garantizar estándares de calidad

**Habilidades requeridas:**
- Pensamiento analítico
- Metodologías de testing
- Atención al detalle

---

### 📋 Metodologías de Trabajo Colaborativo

#### Scrum Adaptado para Investigación

**Sprints de investigación:** Ciclos de 2-3 semanas

**Ceremonias:**
- **Daily standup** (opcional): Check-in semanal rápido
- **Sprint planning:** Definir objetivos del sprint
- **Sprint review:** Presentar resultados
- **Retrospectiva:** Aprender y mejorar

**Artefactos:**
- **Product backlog:** Lista de tareas del proyecto
- **Sprint backlog:** Tareas del sprint actual
- **Incremento:** Avance tangible al final del sprint

---

#### Kanban para Gestión Visual

**Columnas típicas:**

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  BACKLOG │   TODO   │  DOING   │  REVIEW  │   DONE   │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│          │          │          │          │          │
│  Tarea A │  Tarea B │  Tarea C │  Tarea D │  Tarea E │
│          │          │          │          │          │
│  Tarea F │  Tarea G │          │          │  Tarea H │
│          │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Ventajas:**
- Visualización clara del progreso
- Limitar trabajo en progreso (WIP)
- Identificar cuellos de botella
- Flexibilidad en prioridades

---

### 🤝 Dinámicas de Colaboración

#### Reuniones de Equipo

**Frecuencia recomendada:**
- **Reunión semanal:** 1 hora para sincronización
- **Reunión de avances:** Cada 2 semanas con todo el semillero
- **Sesiones de trabajo:** Ad-hoc según necesidad

**Agenda tipo:**
1. Revisión de avances (20 min)
2. Discusión de bloqueos (15 min)
3. Planificación de próximos pasos (20 min)
4. Conclusiones y acuerdos (5 min)

---

#### Comunicación en la Plataforma

**Canales sugeridos:**
- **Comentarios en avances:** Para feedback específico
- **Foro de proyecto:** Para discusiones técnicas
- **Chat del equipo:** Para comunicación rápida
- **Notificaciones:** Para alertas importantes

---

### 📊 Ejemplo de Equipo para un Proyecto

**Proyecto: Sistema de Recomendación de Contenido Educativo con IA**

| Rol | Nombre | Responsabilidad Principal |
|-----|--------|---------------------------|
| 👨‍💼 Líder de Proyecto | Ana Torres | Coordinación general y presentaciones |
| 🔬 Investigador Principal | Dr. Carlos Ruiz | Metodología y papers |
| 💻 Desarrollador Backend | Luis Méndez | Implementación de algoritmos ML |
| 💻 Desarrollador Frontend | Sara Gómez | Interfaz web de prueba |
| 📊 Analista de Datos | María López | Limpieza y análisis de datasets |
| 📝 Documentador | Jorge Silva | Informes y documentación técnica |
| 🧪 Tester | Claudia Vargas | Validación de recomendaciones |

**Tamaño recomendado:** 4-7 integrantes por proyecto

---

### 🎯 Asignación de Tareas en la Plataforma

La plataforma permitirá:

- ✅ Crear tareas específicas para cada miembro
- ✅ Asignar responsables
- ✅ Establecer fechas límite
- ✅ Marcar prioridades (alta, media, baja)
- ✅ Trackear tiempo dedicado (opcional)
- ✅ Ver carga de trabajo de cada miembro
- ✅ Recibir notificaciones de tareas asignadas

**Visualización en el proyecto:**

```markdown
### Tareas Pendientes

- [ ] Implementar modelo de recomendación (Luis) - Vence: 25/03
- [x] Recolectar dataset de usuarios (María) - Completado
- [ ] Diseñar mockup de interfaz (Sara) - Vence: 22/03
- [ ] Revisar paper de referencia (Carlos) - Vence: 20/03
```

---

## 6. Tecnologías Recomendadas

### Frontend
- **Framework:** Angular
- **UI Library:** Angular Material
- **Estado:** NgRx (opcional)
- **Gráficos:** Chart.js

### Backend
- **BaaS:** Supabase
  - ✅ Base de datos PostgreSQL
  - ✅ Autenticación integrada
  - ✅ Storage para archivos
  - ✅ APIs REST automáticas
  - ✅ Realtime subscriptions
  - ✅ Row Level Security

### Integraciones Adicionales
- **IA Conversacional:** API de Gemini o OpenAI
- **Control de versiones:** GitHub
- **Hosting:** Vercel o Netlify
- **Analytics:** Google Analytics

---

## 7. Estructura Básica de Base de Datos

### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) CHECK (rol IN ('visitante', 'miembro', 'administrador')),
  carrera VARCHAR(100),
  semestre INTEGER,
  foto_url TEXT,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  activo BOOLEAN DEFAULT true
);
```

---

### Tabla: `proyectos`

```sql
CREATE TABLE proyectos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(30) CHECK (estado IN ('idea', 'desarrollo', 'investigacion', 'pruebas', 'finalizado', 'cancelado', 'pausa')),
  fecha_inicio DATE DEFAULT NOW(),
  fecha_fin DATE,
  creador_id UUID REFERENCES usuarios(id),
  publico BOOLEAN DEFAULT false,
  repositorio_url TEXT
);
```

---

### Tabla: `miembros_proyecto`

```sql
CREATE TABLE miembros_proyecto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_equipo VARCHAR(50), -- 'lider', 'desarrollador', 'investigador', etc.
  fecha_union DATE DEFAULT NOW(),
  activo BOOLEAN DEFAULT true,
  UNIQUE(proyecto_id, usuario_id)
);
```

---

### Tabla: `ideas`

```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  autor_id UUID REFERENCES usuarios(id),
  estado VARCHAR(30) CHECK (estado IN ('votacion', 'aprobada', 'rechazada', 'modificacion')),
  fecha_publicacion TIMESTAMP DEFAULT NOW(),
  votos_favor INTEGER DEFAULT 0,
  votos_contra INTEGER DEFAULT 0
);
```

---

### Tabla: `avances`

```sql
CREATE TABLE avances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(200),
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  autor_id UUID REFERENCES usuarios(id),
  metricas JSONB -- Para guardar métricas flexibles
);
```

---

### Tabla: `archivos`

```sql
CREATE TABLE archivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  tipo VARCHAR(50), -- 'diapositiva', 'paper', 'dataset', 'codigo', etc.
  tamaño_bytes BIGINT,
  proyecto_id UUID REFERENCES proyectos(id),
  avance_id UUID REFERENCES avances(id),
  subido_por UUID REFERENCES usuarios(id),
  fecha_subida TIMESTAMP DEFAULT NOW(),
  descargas INTEGER DEFAULT 0,
  publico BOOLEAN DEFAULT false
);
```

---

### Tabla: `comentarios`

```sql
CREATE TABLE comentarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contenido TEXT NOT NULL,
  autor_id UUID REFERENCES usuarios(id),
  proyecto_id UUID REFERENCES proyectos(id),
  avance_id UUID REFERENCES avances(id),
  idea_id UUID REFERENCES ideas(id),
  fecha TIMESTAMP DEFAULT NOW()
);
```

---

### Tabla: `tareas`

```sql
CREATE TABLE tareas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  asignado_a UUID REFERENCES usuarios(id),
  estado VARCHAR(20) CHECK (estado IN ('pendiente', 'en_progreso', 'revision', 'completada')),
  prioridad VARCHAR(20) CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
  fecha_limite DATE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_completada TIMESTAMP
);
```

---

## 8. Función Avanzada: Asistente de Proyectos con IA

### 🤖 Características del Asistente

**Capacidades:**
- Responder preguntas sobre metodologías de investigación
- Sugerir datasets relevantes para proyectos
- Recomendar papers científicos relacionados
- Ayudar con debugging de código
- Generar ideas de features
- Explicar conceptos de ML/IA
- Resumir avances largos
- Traducir documentos técnicos

**Ejemplo de conversación:**

```
Usuario: "Necesito ideas de datasets para entrenar un modelo 
de predicción climática"

🤖 Asistente DivergenIA:
Te sugiero los siguientes datasets públicos:

1. **NOAA Climate Data Online**
   - 175+ años de datos climáticos
   - URL: ncdc.noaa.gov/cdo-web/

2. **Kaggle Weather Dataset**
   - Datos meteorológicos de 200+ ciudades
   - Ideal para modelos de ML

3. **ERA5 Reanalysis (Copernicus)**
   - Datos horarios desde 1979
   - Cobertura global

Para tu proyecto, recomiendo empezar con Kaggle 
por su facilidad de uso.

¿Necesitas ayuda con el preprocesamiento?
```

**Integración técnica:**
- API de Gemini 1.5 Pro
- API de OpenAI GPT-4
- Contexto enriquecido con info del proyecto
- Historial de conversación persistente

---

## 9. Beneficios Reales para el Semillero

### 📈 Organización y Gestión

- ✅ Centralización de toda la información
- ✅ Historial completo de investigación
- ✅ Trazabilidad de decisiones
- ✅ Reducción de información dispersa
- ✅ Continuidad entre generaciones de estudiantes

### 🤝 Colaboración

- ✅ Trabajo en equipo más eficiente
- ✅ Comunicación asíncrona efectiva
- ✅ Menor dependencia de reuniones presenciales
- ✅ Onboarding rápido de nuevos miembros
- ✅ Transparencia en contribuciones

### 🎓 Aprendizaje y Desarrollo

- ✅ Documentación como fuente de aprendizaje
- ✅ Mentoring entre miembros
- ✅ Portafolio de proyectos para cada estudiante
- ✅ Desarrollo de soft skills (trabajo en equipo, gestión)
- ✅ Experiencia con metodologías ágiles

### 🏆 Visibilidad e Impacto

- ✅ Showcase de proyectos a la universidad
- ✅ Atracción de nuevos talentos
- ✅ Posibilidad de publicaciones académicas
- ✅ Evidencia para acreditaciones
- ✅ Networking con otros semilleros

### 📊 Métricas y Evaluación

- ✅ KPIs de productividad
- ✅ Reportes automáticos de avance
- ✅ Análisis de participación
- ✅ Identificación de áreas de mejora
- ✅ Justificación de recursos y presupuestos

---

## 10. Roadmap de Implementación

### Fase 1: MVP (Minimum Viable Product) - 2 meses

**Features esenciales:**
- ✅ Autenticación de usuarios
- ✅ CRUD de proyectos
- ✅ Subida de archivos básica
- ✅ Dashboard simple
- ✅ Página pública del semillero

---

### Fase 2: Colaboración - 1.5 meses

**Agregar:**
- ✅ Sistema de comentarios
- ✅ Banco de ideas con votación
- ✅ Registro de avances
- ✅ Perfiles de miembros
- ✅ Notificaciones básicas

---

### Fase 3: Avanzado - 2 meses

**Agregar:**
- ✅ Asistente con IA
- ✅ Sistema de tareas y Kanban
- ✅ Biblioteca avanzada con búsqueda
- ✅ Reportes y analytics
- ✅ Integración con Git

---

### Fase 4: Optimización - Continuo

**Mejoras:**
- ✅ Performance optimization
- ✅ UX improvements
- ✅ Seguridad avanzada
- ✅ Features basados en feedback
- ✅ Escalabilidad

---

## 11. Recursos Estimados

### Equipo de Desarrollo

| Rol | Dedicación | Duración |
|-----|-----------|----------|
| Frontend Developer | 15 hrs/semana | 5 meses |
| Backend/DB Developer | 10 hrs/semana | 5 meses |
| UI/UX Designer | 5 hrs/semana | 2 meses |
| QA Tester | 5 hrs/semana | 3 meses |

### Costos

| Servicio | Costo Mensual | Notas |
|----------|---------------|-------|
| Supabase Free Tier | $0 | Hasta 500MB DB, 1GB storage |
| Dominio (.com) | $12/año | Opcional |
| API Gemini | $0 - $10 | Según uso |
| Hosting (Vercel) | $0 | Plan gratuito suficiente |
| **Total estimado** | **~$2/mes** | **Muy económico** |

---

## 12. Criterios de Éxito

### KPIs (Key Performance Indicators)

1. **Adopción:**
   - Meta: 80% de miembros activos mensuales

2. **Contenido:**
   - Meta: 15+ proyectos documentados en 6 meses

3. **Colaboración:**
   - Meta: 100+ comentarios/mes entre miembros

4. **Visibilidad:**
   - Meta: 200+ visitas mensuales de externos

5. **Satisfacción:**
   - Meta: 4.5/5 en encuesta de satisfacción

---

## 13. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Baja adopción por miembros | Media | Alto | Capacitaciones y gamificación |
| Problemas de seguridad | Baja | Alto | Auditorías y Row Level Security |
| Contenido desactualizado | Alta | Medio | Recordatorios automáticos |
| Sobrecarga del administrador | Media | Medio | Moderar permisos distribuidos |
| Falta de mantenimiento | Media | Alto | Documentar código y procesos |

---

## 14. Conclusión

La **Plataforma Digital DivergenIA** representa una oportunidad única para transformar la manera en que el semillero gestiona conocimiento, colabora y proyecta su trabajo investigativo.

**Ventajas clave:**
- 💰 Bajo costo de implementación
- 🚀 Tecnologías modernas y escalables
- 📚 Centralización de conocimiento
- 🤝 Fomento de colaboración
- 🎓 Desarrollo de habilidades profesionales
- 🏆 Mayor visibilidad institucional

**Próximo paso sugerido:**
Presentar esta propuesta al líder del semillero y comenzar con un **MVP en 2 meses** que demuestre valor inmediato a los miembros.

---

## 15. Anexos

### A. Mockups Sugeridos

*[Aquí se podrían incluir wireframes o enlaces a diseños en Figma]*

### B. Referencias Técnicas

- [Documentación de Supabase](https://supabase.com/docs)
- [Angular Official Docs](https://angular.io/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)

### C. Benchmarks

Plataformas similares de referencia:
- **Notion** (gestión de proyectos)
- **GitHub Projects** (colaboración en código)
- **Trello** (visualización Kanban)
- **Confluence** (documentación de equipos)

---

**Documento preparado para:** Semillero de Investigación DivergenIA  
**Fecha:** 10 de marzo de 2026  
**Versión:** 1.0  

---

*"La mejor manera de predecir el futuro es crearlo."*  
— Peter Drucker
