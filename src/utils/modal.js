export const generateProjectTemplate = ({title, image, description, stacks, github, url}) => {
  return `
    <img class="banner" src="${image}" alt='${ title }'>
    <div>
      <h2 class="title">${title || ''}</h2>
      <h3 class="subtitle">Descripción:</h3>
      <div>${description || '<p>Inserte contenido aqui</p>'}</div>
      <h3 class="subtitle">Tecnologías:</h3>
      <ul class="list">
        ${stacks.map(stack => (
          `<li>${stack}</li>`
        )).join('')}
      </ul>
      <div class="buttons">
        ${github ? (
          `<a target="_blank" href="${github}" class="button button--secondary">
            Código
            <i class="fab fa-github"></i>
          </a>`
        ) : ''}
        ${url ? (
          `<a href="${url}" target="_blank" class="button button--primary">
            Preview
            <i class="fa fa-link"></i>
          </a>`
        ) : ''}
      </div>
    </div>
  `
}

const handleCloseModal = (e) => {
  let $target = e.target

  if($target.classList.contains('modal') || $target.classList.contains('modal__close')) {
    document.body.style.overflow = ''
    while(!$target.classList.contains('modal')) {
      console.log('Executing')
      $target = $target.parentElement
    }
    $target.removeEventListener('click', handleCloseModal)
    $target.remove()
  }
}

export const generateModal = (project) => {
  const $modal = document.createElement('div')
  $modal.classList.add('modal')

  $modal.innerHTML = `
    <article class="modal__content">
      <div class="modal__body">
        <button class="modal__close">
          <i class="fa fa-times"></i>
        </button>
        ${generateProjectTemplate(project)}
      </div>
    </article>
  `.trim()

  $modal.addEventListener('click', handleCloseModal)

  document.body.style.overflow = 'hidden'

  return $modal
}