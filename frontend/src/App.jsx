import { useState, useEffect, useCallback } from 'react'
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import { getNotes, createNote, updateNote, deleteNote } from './api/notesApi'

export default function App() {
  const [notes, setNotes]       = useState([])
  const [view, setView]         = useState('list')   // 'list' | 'form'
  const [editing, setEditing]   = useState(null)     // Note object or null (create)
  const [toast, setToast]       = useState(null)     // { msg, type }
  const [loading, setLoading]   = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadNotes = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getNotes()
      setNotes(data)
    } catch {
      showToast('Failed to load notes.', 'danger')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadNotes() }, [loadNotes])

  async function handleSubmit(formData) {
    try {
      if (editing?.id) {
        await updateNote(editing.id, formData)
        showToast('Note updated successfully!')
      } else {
        await createNote(formData)
        showToast('Note created successfully!')
      }
      setView('list')
      setEditing(null)
      loadNotes()
    } catch {
      showToast('Failed to save note.', 'danger')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNote(id)
      showToast('Note deleted successfully!')
      loadNotes()
    } catch {
      showToast('Failed to delete note.', 'danger')
    }
  }

  function handleEdit(note) {
    setEditing(note)
    setView('form')
  }

  function handleCancel() {
    setEditing(null)
    setView('list')
  }

  return (
    <div className="container py-5">

      {/* Toast */}
      {toast && (
        <div className={`alert alert-${toast.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-1`}></i>
          {toast.msg}
          <button type="button" className="btn-close" onClick={() => setToast(null)}></button>
        </div>
      )}

      {view === 'list' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0"><i className="bi bi-journal-text me-2"></i>Notes</h2>
            <button className="btn btn-primary" onClick={() => { setEditing(null); setView('form') }}>
              <i className="bi bi-plus-lg me-1"></i>New Note
            </button>
          </div>
          {loading
            ? <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            : <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
          }
        </>
      )}

      {view === 'form' && (
        <div className="row justify-content-center">
          <div className="col-md-7">
            <NoteForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

    </div>
  )
}
