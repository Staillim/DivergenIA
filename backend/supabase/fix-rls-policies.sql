-- Script para configurar correctamente las políticas RLS en la tabla usuarios
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query

-- 1. Eliminar todas las políticas existentes de la tabla usuarios
DROP POLICY IF EXISTS "Perfiles visibles para todos" ON public.usuarios;
DROP POLICY IF EXISTS "Insertar perfil propio" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios editan su perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Users can read own profile" ON public.usuarios;

-- 2. Habilitar RLS en la tabla usuarios (si no está habilitado)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas correctas y sin conflictos

-- Política SELECT: Los usuarios autenticados solo pueden leer su propio perfil
CREATE POLICY "usuarios_select_own"
ON public.usuarios
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política INSERT: Los usuarios autenticados pueden insertar su propio perfil
CREATE POLICY "usuarios_insert_own"
ON public.usuarios
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política UPDATE: Los usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "usuarios_update_own"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. (Opcional) Si necesitas que los admins vean todos los perfiles
-- Descomenta esto solo si tienes un sistema de roles
-- CREATE POLICY "usuarios_admin_all"
-- ON public.usuarios
-- FOR ALL
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.usuarios
--     WHERE id = auth.uid() AND rol = 'admin'
--   )
-- );

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname;
