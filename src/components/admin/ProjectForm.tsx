import { useId } from "react"
import type { Option, ProjectType, ProjectValidationErrors } from "../../types"
import Select from "react-select/creatable"
import { getProjectImageURL } from "../../utils/helpers"

export default function ProjectForm({
  values,
  setValues,
  validationErrors,
  project,
  tecnologies,
  addTecnology,
  isLoading
}: {
  values: readonly Option[],
  setValues: React.Dispatch<React.SetStateAction<readonly Option[]>>,
  validationErrors: ProjectValidationErrors,
  project?: ProjectType,
  tecnologies: Option[],
  addTecnology: (inputValue: string) => Promise<{
    label: any;
    value: any;
  }>,
  isLoading: boolean
}) {
  const selectId = useId()

  const handleCreateTecnology = async (inputValue: string) => {
    const newOption = await addTecnology(inputValue)
    setValues(prev => [...prev, newOption])
  }

  return (
    <>
      <div className="form-group">
        <label htmlFor="project-title" className="form-label">Titulo</label>
        <input type="text" className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`} name="title" id="project-title" placeholder="Proyecto #1" defaultValue={ project?.title || '' } />
        {validationErrors.title && (
          <div className="invalid-feedback">
            {validationErrors.title}
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="project-thumbnail">Example file input</label>
        <input
          type="file"
          className={`form-control-file ${validationErrors.thumbnail ? 'is-invalid' : ''}`}
          name="thumbnail"
          id="project-thumbnail"
          accept="image/*"
        />
        {validationErrors.thumbnail && (
          <div className="invalid-feedback">
            {validationErrors.thumbnail}
          </div>
        )}
        { project?.main_thumbnail && (
          <img className="img-fluid img-thumbnail mt-3" src={ getProjectImageURL(project.main_thumbnail) } alt={ project.title } />
        ) }
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
          className="is-invalid"
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: state.isFocused ?
                '#ddd' : !validationErrors.tecnologies ?
                  '#ddd' : 'red',
              '&:hover': {
                borderColor: state.isFocused ?
                  '#ddd' : !validationErrors.tecnologies ?
                    '#ddd' : 'red'
              }
            })
          }}
        />
        {validationErrors.tecnologies && (
          <div className="invalid-feedback">
            {validationErrors.tecnologies}
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="project-content" className="form-label">Contenido</label>
        <textarea name="content" rows={5} id="project-content" className={`${validationErrors.content ? 'is-invalid' : ''} form-control`} placeholder="Contenido del proyecto #1" defaultValue={ project?.content || '' }></textarea>
        {validationErrors.content && (
          <div className="invalid-feedback">
            {validationErrors.content}
          </div>
        )}
      </div>
    </>
  )
}