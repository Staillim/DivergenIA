import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiUpload, FiDownload, FiSearch, FiFile } from 'react-icons/fi'
import toast from 'react-hot-toast'
import '../styles/library.css'

function Library() {
  const { profile } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('todos')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadFiles()
  }, [])

  async function loadFiles() {
    try {
      const { data, error } = await supabase
        .from('archivos')
        .select('*, usuarios(nombre)')
        .order('fecha_subida', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    // Limitar tamaño a 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error('El archivo no puede superar 50MB')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${profile.id}/${Date.now()}_${sanitizedName}`

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('library')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('library')
        .getPublicUrl(filePath)

      // Determinar tipo
      const typeMap = {
        pdf: 'documento',
        doc: 'documento', docx: 'documento',
        ppt: 'diapositiva', pptx: 'diapositiva',
        csv: 'dataset', json: 'dataset', sql: 'dataset',
        py: 'codigo', js: 'codigo', ts: 'codigo', ipynb: 'codigo',
        mp4: 'video', mov: 'video',
        jpg: 'imagen', png: 'imagen', gif: 'imagen'
      }
      const tipo = typeMap[fileExt?.toLowerCase()] || 'otro'

      // Registrar en DB
      const { error: dbError } = await supabase.from('archivos').insert({
        nombre: file.name,
        url: publicUrl,
        tipo,
        tamanio_bytes: file.size,
        subido_por: profile.id,
        publico: false
      })

      if (dbError) throw dbError

      toast.success('¡Archivo subido exitosamente!')
      loadFiles()
    } catch (error) {
      toast.error('Error al subir archivo: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const filtered = files.filter(f => {
    const matchSearch = f.nombre.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'todos' || f.tipo === filterType
    return matchSearch && matchType
  })

  const typeIcons = {
    documento: '📄',
    diapositiva: '📊',
    dataset: '💾',
    codigo: '💻',
    video: '🎥',
    imagen: '🖼️',
    otro: '📁'
  }

  const formatSize = (bytes) => {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1>📚 Biblioteca</h1>
        <label className={`btn btn-primary ${uploading ? 'btn-disabled' : ''}`}>
          <FiUpload /> {uploading ? 'Subiendo...' : 'Subir Archivo'}
          <input
            type="file"
            hidden
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar archivos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-chips">
          {['todos', 'documento', 'diapositiva', 'dataset', 'codigo', 'video', 'imagen'].map(type => (
            <button
              key={type}
              className={`chip ${filterType === type ? 'chip-active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type === 'todos' ? 'Todos' : `${typeIcons[type]} ${type}`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtered.length > 0 ? (
        <div className="library-list">
          {filtered.map(file => (
            <div key={file.id} className="library-item card">
              <div className="library-icon">{typeIcons[file.tipo] || '📁'}</div>
              <div className="library-info">
                <h4>{file.nombre}</h4>
                <div className="library-meta">
                  <span>{file.usuarios?.nombre}</span>
                  <span>{formatSize(file.tamanio_bytes)}</span>
                  <span>{new Date(file.fecha_subida).toLocaleDateString('es-CO')}</span>
                  <span className="badge badge-idea">{file.tipo}</span>
                </div>
              </div>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                <FiDownload /> Descargar
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">📚</div>
          <p>No hay archivos en la biblioteca</p>
        </div>
      )}
    </div>
  )
}

export default Library
