import { useEffect, useState } from "react";
import type { ProjectType } from "../../types";
import CreateProject from "./CreateProject";
import { supabase } from "../../config/supabase";
import UpdateProject from "./UpdateProject";

export default function ProjectList() {
  const [loading, setLoading] = useState<boolean>(true)
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [deletingId, setDeletingId] = useState<number|null>(null)
  const [currentProjectToUpdate, setCurrentProjectToUpdate] = useState<ProjectType|null>(null)

  useEffect(() => {
    supabase
      .from('projects')
      .select(`
        *,
        project_tecnology(
          *,
          tecnologies(*)
        )
      `)
      .then(({ data }) => {
        setProjects(data?.map(d => (
          {
            ...d,
            tecnologies: d.project_tecnology.map((pt: { tecnologies: [] }) => pt.tecnologies)
          }))
          || [] as ProjectType[]
        )
        setLoading(false)
      })
  }, [])

  const handleDeleteProject = async (projectId: number) => {
    setDeletingId(projectId)
    const { data } = await (await fetch(`/api/projects/${ projectId }/destroy`, {
      method: 'DELETE'
    })).json()
    console.log(data)
    setProjects(previous => previous.filter(p => p.id != projectId))
    setDeletingId(null)
  }

  const handleEditProjet = (project: ProjectType) => {
    setCurrentProjectToUpdate(project)
  }

  return (
    <>
      <CreateProject
        setProjects={ setProjects }
      />
      <UpdateProject
        project={ currentProjectToUpdate }
        setProjects={ setProjects }
      />
      <div className="card">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Proyectos</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {
              loading
                ? (
                  <p>Loading...</p>
                )
                : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr className="thead-light">
                          <th>Imagen</th>
                          <th>Titulo</th>
                          <th>Tecnologias</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects?.map(project => (
                          <tr key={project.id}>
                            <td>
                              <a target="_blank" href={`https://cptqwyxiumlnxciqeena.supabase.co/storage/v1/object/public/${project.main_thumbnail}`}>
                                <img style={{
                                  width: 100,
                                  objectFit: 'cover',
                                  aspectRatio: 1
                                }} className="img-thumbnail" src={`https://cptqwyxiumlnxciqeena.supabase.co/storage/v1/object/public/${project.main_thumbnail}`} alt={project.title} />
                              </a>
                            </td>
                            <td>{project.title}</td>
                            <td>{project.tecnologies.map(({ tecnology, id }) => (
                              <span className="badge badge-secondary mr-1" key={id}>{tecnology}</span>
                            ))}</td>
                            <td>{new Intl.DateTimeFormat('es-ES', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }).format(new Date(project.created_at))}</td>
                            <td>
                              <button disabled={ deletingId === project.id } onClick={() => { handleDeleteProject(project.id) }} className="btn btn-danger mr-1">
                                {
                                  deletingId === project.id
                                  ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  : <i className="fa fa-trash"></i>
                                }
                              </button>
                              <button onClick={ () => handleEditProjet(project) } data-toggle="modal" data-target="#modal-edit-project" className="btn btn-warning">
                                <i className="fa fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!projects.length && (
                          <tr>
                            <td colSpan={5}>
                              <div className="alert alert-info">
                                Sin datos
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </>
  )
}