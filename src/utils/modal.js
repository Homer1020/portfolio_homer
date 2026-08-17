export const generateProjectTemplate = ({title, image, description, stacks, github, url, gallery}) => {
  return `
    <img class="banner" src="${image}" alt='${ title }'>
    <div>
      <h2 class="title">${title || ''}</h2>
      <h3 class="subtitle">Descripción:</h3>
      <div class="styled-content">${description || '<p>Inserte contenido aqui</p>'}</div>
      ${gallery && gallery.length ? `
        <h3 class="subtitle">Galería:</h3>
        <div class="modal-gallery">
          ${gallery.map(url => (
            `<button type="button" class="modal-gallery__item${url === image ? ' active' : ''}" data-image="${url}">
              <img src="${url}" alt="${title || ''}" loading="lazy">
            </button>`
          )).join('')}
        </div>
      ` : ''}
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

const handleGalleryClick = (e) => {
  const $item = e.target.closest('.modal-gallery__item')
  if (!$item) return

  const $modal = $item.closest('.modal')
  const $banner = $modal?.querySelector('.banner')
  if (!$banner || !$item.dataset.image) return

  $banner.src = $item.dataset.image
  $modal.querySelectorAll('.modal-gallery__item.active').forEach($el => $el.classList.remove('active'))
  $item.classList.add('active')
}

export const showModal = (content, config = {}) => {
  const $modal = config?.modalSelector
    ? document.getElementById(config.modalSelector)
    : document.createElement('div')
  $modal.classList.add('modal')

  $modal.innerHTML = `
    <article class="modal__content" ${ config?.contentStyle ? `style="${ config.contentStyle }"` : '' }>
      <div class="modal__body">
        <button class="modal__close">
          <i class="fa fa-times"></i>
        </button>
        ${content}
      </div>
    </article>
  `.trim()

  $modal.addEventListener('click', handleCloseModal)
  $modal.addEventListener('click', handleGalleryClick)

  document.body.style.overflow = 'hidden'

  return $modal
}

export const generateModal = (project) => showModal(generateProjectTemplate(project))