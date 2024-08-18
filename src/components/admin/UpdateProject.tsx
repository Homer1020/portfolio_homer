import { useEffect, useState, type FormEvent } from "react";
import type { Option, ProjectType } from "../../types";
import ProjectForm from "./ProjectForm";

export default function UpdateProject({
  project,
  setProjects,
  setCurrentProjectToUpdate,
  tecnologies,
  addTecnology,
  isLoading,
}: {
  project: ProjectType|null,
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>,
  setCurrentProjectToUpdate: React.Dispatch<React.SetStateAction<ProjectType | null>>,
  addTecnology: (inputValue: string) => Promise<{
    label: any;
    value: any;
  }>,
  tecnologies: Option[],
  isLoading: boolean
}) {
  const [isUpdatingProject, setIsUpdatingProject] = useState<boolean>(false)
  const [values, setValues] = useState<readonly Option[]>([])
  const [validationErrors, setValidationErrors] = useState<{
    title?: string,
    content?: string,
    thumbnail?: string,
    tecnologies?: string,
  }>({})

  useEffect(() => {
    $('#modal-edit-project').on('hidden.bs.modal', function (e) {
      setValues([])
      setCurrentProjectToUpdate(null)
      $('#modal-edit-project form').trigger('reset')
    })
  }, [])

  useEffect(() => {
    if(project) setValues(project.tecnologies.map(p => ({ value: `${ p.id }`, label: p.tecnology })))
  }, [project])

  const handleUpdateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdatingProject(true)
    if(!project) { return null }
    const form = e.currentTarget
    const fd = new FormData(form)

    /*
      append aditional data
    */
    fd.append('current_thumbnail_path', project.main_thumbnail)
    values.forEach(tecnology => {
      fd.append('tecnologies', tecnology.value)
    })

    const res = await fetch(`/api/projects/${ project.id }/update`, {
      method: 'PUT',
      body: fd
    })
    const data = await res.json()

    if(data) {
      const projectDB = data.data[0]
      const projectDBFormated = {...projectDB, tecnologies: values.map(value => ({ id: value.value, tecnology: value.label }))}
      setProjects(projects => projects.map(project => project.id === projectDB.id ? projectDBFormated : project))
      $('#modal-edit-project').modal('hide')
      setValues([])
      form.reset()
    }
    setIsUpdatingProject(false)
  }

  return (
    <div className="modal fade" id="modal-edit-project" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Actualizar proyecto</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            { project && (
              <form id="form-update-project" encType="multipart/form-data" onSubmit={ handleUpdateProject }>
                <ProjectForm
                  setValues={ setValues }
                  values={ values }
                  validationErrors={ validationErrors }
                  project={ project }
                  tecnologies={ tecnologies }
                  addTecnology={ addTecnology }
                  isLoading={ isLoading }
                />
              </form>
            ) }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button disabled={ isUpdatingProject } form="form-update-project" type="submit" className="btn btn-primary">
              {
                isUpdatingProject
                ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                    <span>Actualizando</span>
                  </>
                )
                : (
                  <>
                    <i className="fa fa-refresh mr-1"></i>
                    <span>Actualizar</span>
                  </>
                )
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}