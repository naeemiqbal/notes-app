import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const empty = { note: '', created: '', active: true }

export default function NoteForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initial ?? empty)
    setErrors({})
  }, [initial])

  function validate() {
    const e = {}
    if (!form.note?.trim()) e.note = 'Note content cannot be empty'
    else if (form.note.length > 500) e.note = 'Note cannot exceed 500 characters'
    return e
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    // If no date supplied, use today
    const payload = { ...form, created: form.created || new Date().toISOString().slice(0, 10) }
    onSubmit(payload)
  }

  const isEdit = Boolean(initial?.id)

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3">
        <h4 className="mb-0">
          <i className={`bi ${isEdit ? 'bi-journal-check' : 'bi-journal-plus'} me-2`}></i>
          {isEdit ? 'Edit Note' : 'Create Note'}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>

          {/* Note text */}
          <div className="mb-3">
            <label htmlFor="note" className="form-label fw-semibold">
              Note <span className="text-danger">*</span>
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              className={`form-control${errors.note ? ' is-invalid' : ''}`}
              placeholder="Write your note here..."
              value={form.note}
              onChange={handleChange}
            />
            {errors.note && <div className="invalid-feedback">{errors.note}</div>}
          </div>

          {/* Date */}
          <div className="mb-3">
            <label htmlFor="created" className="form-label fw-semibold">Date</label>
            <input
              type="date"
              id="created"
              name="created"
              className="form-control"
              value={form.created ?? ''}
              onChange={handleChange}
            />
            {!isEdit && <div className="form-text">Leave blank to use today&apos;s date.</div>}
          </div>

          {/* Active toggle */}
          <div className="mb-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="active"
                name="active"
                checked={form.active ?? true}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="active">Active</label>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-save me-1"></i>{isEdit ? 'Update' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              <i className="bi bi-arrow-left me-1"></i>Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

NoteForm.propTypes = {
  initial:  PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
