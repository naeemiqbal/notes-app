import PropTypes from 'prop-types'

export default function NoteList({ notes, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Note</th>
              <th>Created</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No notes found. Create one!
                </td>
              </tr>
            )}
            {notes.map((n) => (
              <tr key={n.id}>
                <td className="align-middle text-muted">{n.id}</td>
                <td className="align-middle">{n.note}</td>
                <td className="align-middle">
                  {n.created
                    ? new Date(n.created + 'T00:00:00').toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })
                    : '—'}
                </td>
                <td className="align-middle">
                  {n.active
                    ? <span className="badge bg-success">Active</span>
                    : <span className="badge bg-secondary">Inactive</span>}
                </td>
                <td className="text-center align-middle">
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(n)}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => { if (window.confirm('Delete this note?')) onDelete(n.id) }}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

NoteList.propTypes = {
  notes:    PropTypes.array.isRequired,
  onEdit:   PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
