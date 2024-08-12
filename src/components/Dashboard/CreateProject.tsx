import { supabase } from "../../config/supabase"

export default function CreateProject() {
  const handleCreateProject = async () => {
    const data = await supabase.from('projects').insert({
      title: 'Second project',
      content: 'Content of my second project',
      slug: 'eeesffssee-project',
      category_id: 1,
    })

    console.log(data)
  }

  return (
    <div className="modal fade" id="modal-create-project" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <button onClick={ () => { handleCreateProject() } }>
              Click me
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary">Save changes</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}