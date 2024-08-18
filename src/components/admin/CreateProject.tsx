import { useRef, type FormEvent, useState, useEffect, useId, type ChangeEvent } from "react"
import type { Option, ProjectType, ProjectValidationErrors } from "../../types"
import ProjectForm from "./ProjectForm"

export default function CreateProject({
  setProjects,
  tecnologies,
  addTecnology,
  isLoading,
}: {
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>,
  tecnologies: Option[],
  addTecnology: (inputValue: string) => Promise<{
    label: any;
    value: any;
  }>,
  isLoading: boolean
}) {
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false)
  const [values, setValues] = useState<readonly Option[]>([])
  const [validationErrors, setValidationErrors] = useState<ProjectValidationErrors>({})

  const modalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    $('#modal-create-project').on('hidden.bs.modal', function (e) {
      setValues([])
      setValidationErrors({})
      $('#modal-create-project form').trigger('reset')
    })
  }, [])

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreatingProject(true)
    const form = e.currentTarget
    const fd = new FormData(form)

    values.forEach(tecnology => {
      fd.append('tecnologies', tecnology.value)
    })

    const res = await fetch('/api/projects/store', {
      method: 'POST',
      body: fd
    })

    const { data, formErrors } = await res.json()
    
    if(formErrors) {
      setValidationErrors(formErrors)
    }

    if(data) {
      const projectDB = data[0]
      const project = {...projectDB, tecnologies: values.map(value => ({ id: value.value, tecnology: value.label }))}
      setProjects(previous => [...previous, project])
      $(modalRef.current as HTMLElement).modal('hide')
      setValues([])
      form.reset()
    }
    setIsCreatingProject(false)
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
            <form id="form-create-project" encType="multipart/form-data" onSubmit={ handleCreateProject }>
              <ProjectForm
                validationErrors={ validationErrors }
                values={ values }
                setValues={ setValues }
                tecnologies={ tecnologies }
                addTecnology={ addTecnology }
                isLoading={ isLoading }
              />
            </form>
          </div>
          <div className="modal-footer">
            <button disabled={ isCreatingProject } form="form-create-project" type="submit" className="btn btn-primary">
              {
                isCreatingProject
                ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                    <span>Guardando</span>
                  </>
                )
                : (
                  <>
                    <i className="fa fa-save mr-1"></i>
                    <span>Guardar</span>
                  </>
                )
              }
            </button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}