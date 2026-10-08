export const generateProjectTemplate = ({ title, image, description, stacks, github, url, gallery }) => {
  const allImages = [image, ...(gallery || [])]
  const uniqueImages = [...new Set(allImages)]
  const hasSlider = uniqueImages.length > 1

  const bannerHtml = hasSlider
    ? `<div class="project-slider owl-carousel">
        ${uniqueImages.map(imgUrl => `
          <div data-dot="<img src='${imgUrl}'>">
            <img class="banner banner--slide" src="${imgUrl}" alt="${title || ''}">
          </div>
        `).join('')}
      </div>`
    : `<img class="banner" src="${image}" alt='${title || ''}'>`

  return `
    ${bannerHtml}
    <div>
      <h2 class="title">${title || ''}</h2>
      <div class="styled-content">${description || '<p>Inserte contenido aqui</p>'}</div>
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

  if ($target.classList.contains('modal') || $target.classList.contains('modal__close')) {
    document.body.style.overflow = ''
    while (!$target.classList.contains('modal')) {
      console.log('Executing')
      $target = $target.parentElement
    }
    $target.removeEventListener('click', handleCloseModal)
    $target.remove()
  }
}

export const showModal = (content, config = {}) => {
  const $modal = config?.modalSelector
    ? document.getElementById(config.modalSelector)
    : document.createElement('div')
  $modal.classList.add('modal')

  $modal.innerHTML = `
    <article class="modal__content" ${config?.contentStyle ? `style="${config.contentStyle}"` : ''}>
      <div class="modal__body">
        <button class="modal__close">
          <i class="fa fa-times"></i>
        </button>
        ${content}
      </div>
    </article>
  `.trim()

  $modal.addEventListener('click', handleCloseModal)

  document.body.style.overflow = 'hidden'

  return $modal
}

export const generateModal = (project) => showModal(generateProjectTemplate(project))

export const initModalSlider = ($modal) => {
  if (window.$ && window.$.fn.owlCarousel) {
    const $slider = window.$($modal).find('.project-slider');
    if ($slider.length) {
      $slider.owlCarousel({
        items: 1,
        dotsData: true,
        dots: true,
        nav: false,
        margin: 20,
        autoHeight: true
      });

      // Aseguramos que el clic funcione siempre
      $slider.on('click', '.owl-dot', function() {
        $slider.trigger('to.owl.carousel', [window.$(this).index(), 300]);
      });
    }
  }
}