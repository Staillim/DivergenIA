-- ============================================
-- DivergenIA - SQL Schema para Supabase
-- ============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- URL: https://app.supabase.com > tu proyecto > SQL Editor
-- ============================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: usuarios
-- Información de perfil de los miembros
-- ============================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  rol VARCHAR(20) DEFAULT 'miembro' CHECK (rol IN ('visitante', 'miembro', 'administrador')),
  carrera VARCHAR(100),
  semestre INTEGER CHECK (semestre >= 1 AND semestre <= 12),
  foto_url TEXT,
  habilidades TEXT[],
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: proyectos
-- Proyectos de investigación del semillero
-- ============================================
CREATE TABLE proyectos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(30) DEFAULT 'idea' CHECK (estado IN ('idea', 'desarrollo', 'investigacion', 'pruebas', 'finalizado', 'cancelado', 'pausa')),
  fecha_inicio DATE DEFAULT NOW(),
  fecha_fin DATE,
  creador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  publico BOOLEAN DEFAULT false,
  repositorio_url TEXT,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: miembros_proyecto
-- Relación entre usuarios y proyectos (equipos)
-- ============================================
CREATE TABLE miembros_proyecto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_equipo VARCHAR(50) DEFAULT 'miembro',
  fecha_union DATE DEFAULT NOW(),
  activo BOOLEAN DEFAULT true,
  UNIQUE(proyecto_id, usuario_id)
);

-- ============================================
-- TABLA: ideas
-- Banco de ideas del semillero
-- ============================================
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  autor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  estado VARCHAR(30) DEFAULT 'votacion' CHECK (estado IN ('votacion', 'aprobada', 'rechazada', 'modificacion')),
  votos_favor INTEGER DEFAULT 0,
  votos_contra INTEGER DEFAULT 0,
  fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: avances
-- Bitácora de avances por proyecto
-- ============================================
CREATE TABLE avances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(200),
  descripcion TEXT,
  autor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  metricas JSONB,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: archivos
-- Biblioteca de archivos del semillero
-- ============================================
CREATE TABLE archivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  tipo VARCHAR(50),
  tamanio_bytes BIGINT,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
  avance_id UUID REFERENCES avances(id) ON DELETE SET NULL,
  subido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  publico BOOLEAN DEFAULT false,
  descargas INTEGER DEFAULT 0,
  fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: comentarios
-- Comentarios en proyectos, avances e ideas
-- ============================================
CREATE TABLE comentarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contenido TEXT NOT NULL,
  autor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  avance_id UUID REFERENCES avances(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: tareas
-- Tareas asignadas dentro de un proyecto
-- ============================================
CREATE TABLE tareas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  asignado_a UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'revision', 'completada')),
  prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
  fecha_limite DATE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_completada TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABLA: votos_idea
-- Registro de quién votó en cada idea (evitar duplicados)
-- ============================================
CREATE TABLE votos_idea (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('favor', 'contra')),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, usuario_id)
);

-- ============================================
-- ÍNDICES para mejorar performance
-- ============================================
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_proyectos_creador ON proyectos(creador_id);
CREATE INDEX idx_miembros_proyecto ON miembros_proyecto(proyecto_id);
CREATE INDEX idx_miembros_usuario ON miembros_proyecto(usuario_id);
CREATE INDEX idx_avances_proyecto ON avances(proyecto_id);
CREATE INDEX idx_archivos_proyecto ON archivos(proyecto_id);
CREATE INDEX idx_ideas_estado ON ideas(estado);
CREATE INDEX idx_tareas_proyecto ON tareas(proyecto_id);
CREATE INDEX idx_tareas_asignado ON tareas(asignado_a);
CREATE INDEX idx_comentarios_proyecto ON comentarios(proyecto_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE miembros_proyecto ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avances ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos_idea ENABLE ROW LEVEL SECURITY;

-- ========== USUARIOS ==========

-- Todos pueden ver perfiles activos
CREATE POLICY "Perfiles visibles para todos"
  ON usuarios FOR SELECT
  USING (activo = true);

-- Usuarios pueden editar su propio perfil
CREATE POLICY "Usuarios editan su perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Permitir insertar perfil al registrarse
CREATE POLICY "Insertar perfil propio"
  ON usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========== PROYECTOS ==========

-- Proyectos públicos visibles para todos, privados para autenticados
CREATE POLICY "Ver proyectos"
  ON proyectos FOR SELECT
  USING (publico = true OR auth.uid() IS NOT NULL);

-- Miembros autenticados pueden crear proyectos
CREATE POLICY "Crear proyectos"
  ON proyectos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Creador o admin puede editar
CREATE POLICY "Editar proyectos"
  ON proyectos FOR UPDATE
  USING (
    auth.uid() = creador_id
    OR EXISTS (
      SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'administrador'
    )
  );

-- ========== MIEMBROS_PROYECTO ==========

CREATE POLICY "Ver miembros de proyecto"
  ON miembros_proyecto FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Gestionar miembros"
  ON miembros_proyecto FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Actualizar membresía"
  ON miembros_proyecto FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ========== IDEAS ==========

CREATE POLICY "Ver ideas"
  ON ideas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Crear ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Editar ideas propias o admin"
  ON ideas FOR UPDATE
  USING (
    auth.uid() = autor_id
    OR EXISTS (
      SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'administrador'
    )
  );

-- ========== AVANCES ==========

CREATE POLICY "Ver avances"
  ON avances FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Crear avances"
  ON avances FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ========== ARCHIVOS ==========

CREATE POLICY "Ver archivos"
  ON archivos FOR SELECT
  USING (publico = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Subir archivos"
  ON archivos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ========== COMENTARIOS ==========

CREATE POLICY "Ver comentarios"
  ON comentarios FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Crear comentarios"
  ON comentarios FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ========== TAREAS ==========

CREATE POLICY "Ver tareas"
  ON tareas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Crear tareas"
  ON tareas FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Editar tareas"
  ON tareas FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ========== VOTOS ==========

CREATE POLICY "Ver votos"
  ON votos_idea FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Votar"
  ON votos_idea FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- ============================================
-- STORAGE BUCKET para archivos
-- ============================================
-- Nota: Crear el bucket 'library' desde el dashboard de Supabase
-- Storage > New Bucket > Name: library > Public: false

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_proyectos_updated_at
  BEFORE UPDATE ON proyectos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DATOS DE EJEMPLO (opcionales)
-- ============================================

-- Nota: Estos datos son de ejemplo.
-- Para insertarlos, primero debes tener un usuario registrado
-- a través de la autenticación de Supabase.

-- Ejemplo (reemplazar UUID con el ID real del usuario):
/*
INSERT INTO proyectos (titulo, descripcion, estado, creador_id, publico) VALUES
  ('IA para predicción de trading', 'Sistema de predicción de mercados financieros usando redes neuronales LSTM', 'desarrollo', 'UUID_DEL_USUARIO', true),
  ('Chatbot educativo con NLP', 'Asistente virtual que responde preguntas sobre temas académicos', 'investigacion', 'UUID_DEL_USUARIO', true),
  ('Detector de plagio con IA', 'Sistema que analiza documentos y detecta similitudes usando embeddings', 'idea', 'UUID_DEL_USUARIO', false);

INSERT INTO ideas (titulo, descripcion, autor_id, estado) VALUES
  ('IA para detectar plagio en trabajos académicos', 'Sistema basado en IA que analice documentos académicos y detecte similitudes con fuentes existentes', 'UUID_DEL_USUARIO', 'votacion'),
  ('Asistente virtual para programación', 'Chatbot que ayude a estudiantes a aprender programación paso a paso', 'UUID_DEL_USUARIO', 'votacion');
*/
