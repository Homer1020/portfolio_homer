import type { ProjectType } from "../../types";
import CreateProject from "./CreateProject";

export default function ProjectList({ data }: { data: ProjectType[] }) {
  return (
    <>
      <CreateProject />
      <div className="card">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Proyectos</h6>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Slug</th>
                <th>Categorias</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(project => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.slug}</td>
                  <td>{project.category_id}</td>
                  <td>{project.created_at}</td>
                  <td>
                    <button className="btn btn-danger mr-1">
                      <i className="fa fa-trash"></i>
                    </button>
                    <button className="btn btn-warning">
                      <i className="fa fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}