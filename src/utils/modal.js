export const generateProjectTemplate = ({title, image, description, stacks, github, url}) => {
  return `
    <img class="banner" src="${image}" alt='Gomishot'>
    <div>
      <h1 class="title">${title || ''}</h1>
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