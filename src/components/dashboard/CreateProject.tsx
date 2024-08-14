import { useRef, type FormEvent, useState, useEffect, useId } from "react"
import type { Option, ProjectType } from "../../types"
import Select from 'react-select/creatable'
import { supabase } from "../../config/supabase"

export default function CreateProject({
  setProjects
}: {
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>
}) {
  const [tecnologies, setTecnologies] = useState<Option[]>([])
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false)

  useEffect(() => {
    supabase
      .from('tecnologies')
      .select()
      .then(({ data }) => {
        if(data) {
          setTecnologies(data.map(tecnology => ({label: tecnology.tecnology, value: tecnology.id})))
        }
      })

      $('#modal-create-project').on('hidden.bs.modal', function (e) {
        setValues([])
        $('#modal-create-project form').trigger('reset')
      })
  }, [])

  const modalRef = useRef<HTMLDivElement>(null)

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

    const result = await res.json()

    if(result) {
      const projectDB = result.data[0]
      const project = {...projectDB, tecnologies: values.map(value => ({ id: value.value, tecnology: value.label }))}
      setProjects(previous => [...previous, project])
      $(modalRef.current as HTMLElement).modal('hide')
      setValues([])
      form.reset()
    }
    setIsCreatingProject(false)
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [values, setValues] = useState<readonly Option[]>([]);

  const handleCreateTecnology = async (inputValue: string) => {
    setIsLoading(true)
    const fd = new FormData()
    fd.append('tecnology', inputValue)
    const res = await fetch('/api/tecnologies/store', {
      method: 'POST',
      body: fd
    })
    const { data } = await res.json()
    const newOption = {
      label: data[0].tecnology,
      value: data[0].id
    }
    setIsLoading(false)
    setTecnologies(prev => [...prev, newOption])
    setValues(prev => [...prev, newOption])
  }

  const selectId = useId()

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
              <div className="form-group">
                <label htmlFor="project-title" className="form-label">Titulo</label>
                <input type="text" className="form-control" name="title" id="project-title" />
              </div>
              <div className="form-group">
                <label htmlFor="project-thumbnail" className="form-label">Imagen</label>
                <input
                  type="file"
                  className="form-control-file"
                  name="thumbnail" 
                  id="project-thumbnail"
                  accept="image/*"
                />
              </div>
              <div className="form-group">
                <label htmlFor={ selectId } className="form-label">Tecnologias</label>
                <Select
                  isDisabled={ isLoading }
                  instanceId={ selectId }
                  isLoading={ isLoading }
                  options={ tecnologies }
                  isClearable
                  placeholder="Seleccione las tecnologias"
                  isMulti
                  onCreateOption={ handleCreateTecnology }
                  onChange={ newValue => setValues(newValue) }
                  value={ values }
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-content" className="form-label">Contenido</label>
                <textarea name="content" rows={5} id="project-content" className="form-control"></textarea>
              </div>
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