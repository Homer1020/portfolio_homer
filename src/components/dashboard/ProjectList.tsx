import { useEffect, useState } from "react";
import type { ProjectType } from "../../types";
import CreateProject from "./CreateProject";
import { supabase } from "../../config/supabase";

export default function ProjectList() {
  const [loading, setLoading] = useState<boolean>(true)
  const [projects, setProjects] = useState<ProjectType[]>([])

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
      .then(({data}) => {
        setProjects(data?.map(d => ({...d, tecnologies: d.project_tecnology.map(pt => pt.tecnologies)})) || [] as ProjectType[])
        setLoading(false)
      })
  }, [])

  const handleDeleteProject = async (projectId: number) => {
    const { data } = await supabase
      .from('projects')
      .delete()
      .match({ id: projectId })
    setProjects(previous => previous.filter(p => p.id != projectId))
  }

  return (
    <>
      <CreateProject setProjects={ setProjects } />
      <div className="card">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Proyectos</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
          {
            loading
            ? <h1 className="h6">Loading...</h1>
            : (
              <table className="table table-bordered">
                <thead>
                  <tr className="thead-light">
                    <th>Titulo</th>
                    <th>Slug</th>
                    <th>Tecnologias</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.map(project => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.slug}</td>
                      <td>{ project.tecnologies.map(({tecnology, id}) => (
                        <span className="badge badge-secondary mr-1" key={ id }>{ tecnology }</span>
                      )) }</td>
                      <td>{project.created_at}</td>
                      <td>
                        <button onClick={ () => { handleDeleteProject(project.id) } } className="btn btn-danger mr-1">
                          <i className="fa fa-trash"></i>
                        </button>
                        <button className="btn btn-warning">
                          <i className="fa fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!projects.length && (
                    <tr>
                      <td colSpan={ 5 }>
                        <div className="alert alert-info">
                          Sin datos
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )
          }
          </div>
        </div>
      </div>
    </>
  )
}