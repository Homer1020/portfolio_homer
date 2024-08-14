import { useEffect, useId, useState, type FormEvent } from "react";
import type { Option, ProjectType } from "../../types";
import { getProjectImageURL } from "../../utils/helpers";
import { supabase } from "../../config/supabase";
import Select from 'react-select/creatable'

export default function UpdateProject({ project }: { project: ProjectType|null }) {
  const selectId = useId()
  const [tecnologies, setTecnologies] = useState<Option[]>([])
  useEffect(() => {
    supabase
      .from('tecnologies')
      .select()
      .then(({ data }) => {
        if(data) {
          setTecnologies(data.map(tecnology => ({label: tecnology.tecnology, value: tecnology.id})))
        }
      })

      $('#modal-edit-project').on('hidden.bs.modal', function (e) {
        setValues([])
        $('#modal-edit-project form').trigger('reset')
      })
  }, [])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [values, setValues] = useState<readonly Option[]>([]);

  useEffect(() => {
    if(project) {
      setValues(project.tecnologies.map(p => ({ value: `${ p.id }`, label: p.tecnology })))
    }
  }, [project])

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

  const handleUpdateProject = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
              <form encType="multipart/form-data" onSubmit={ handleUpdateProject }>
                <div className="form-group">
                  <label htmlFor="project-title" className="form-label">Titulo</label>
                  <input type="text" defaultValue={ project.title } className="form-control" name="title" id="project-title" />
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
                  <img src={getProjectImageURL(project.main_thumbnail)} alt="Vista previa" style={{ aspectRatio: 16/9, objectFit: 'cover' }} className="img-fluid img-thumbnail mt-3 d-block" width={300} />
                </div>
                <div className="form-group">
                  <label htmlFor={selectId} className="form-label">Tecnologias</label>
                  <Select
                    isDisabled={isLoading}
                    instanceId={selectId}
                    isLoading={isLoading}
                    options={tecnologies}
                    isClearable
                    placeholder="Seleccione las tecnologias"
                    isMulti
                    onCreateOption={handleCreateTecnology}
                    onChange={newValue => setValues(newValue)}
                    value={values}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project-content" className="form-label">Contenido</label>
                  <textarea name="content" rows={5} id="project-content" className="form-control" defaultValue={ project.content }/>
                </div>
              </form>
            ) }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" className="btn btn-primary">
              <i className="fa fa-refresh mr-1"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}