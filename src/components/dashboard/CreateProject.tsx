import { useRef, type FormEvent } from "react"
import type { ProjectType } from "../../types"

export default function CreateProject({
  setProjects
}: {
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    console.log(fd)

    const res = await fetch('/api/projects/store', {
      method: 'POST',
      body: fd
    })

    const result = await res.json()

    console.log(result)

    if(result) {
      const project = result.data[0]
      setProjects(previous => [...previous, project])
      $(modalRef.current as HTMLElement).modal('hide')
      form.reset()
    }
  }

  return (
    <div ref={ modalRef } className="modal fade" id="modal-create-project" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo proyecto</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form id="form-create-project" onSubmit={ handleCreateProject }>
              <div className="form-group">
                <label htmlFor="project-title" className="form-label">Titulo</label>
                <input type="text" className="form-control" name="title" id="project-title" />
              </div>
              <div className="form-group">
                <label htmlFor="project-content" className="form-label">Contenido</label>
                <textarea name="content" id="project-content" className="form-control"></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button form="form-create-project" type="submit" className="btn btn-primary">Guardar</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}