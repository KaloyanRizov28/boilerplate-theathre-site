export const EMPTY_SHOW_FORM = {
  title: '',
  category: '',
  author: '',
  information: '',
  image_URL: '',
  poster_URL: '',
  picture_personalURL: '',
}

export const SHOW_IMAGE_FIELD_MAP = {
  poster: {
    key: 'poster',
    label: 'Постер',
    urlField: 'poster_URL',
    folder: 'poster',
    previewAlt: 'poster preview',
    previewClassName: 'h-40 w-28 object-cover rounded',
    wrapperClassName: '',
  },
  image: {
    key: 'image',
    label: 'Основно изображение',
    urlField: 'image_URL',
    folder: 'image',
    previewAlt: 'image preview',
    previewClassName: 'h-32 w-56 object-cover rounded',
    wrapperClassName: '',
  },
  landscape: {
    key: 'landscape',
    label: 'Хоризонтално изображение',
    urlField: 'picture_personalURL',
    folder: 'landscape',
    previewAlt: 'landscape preview',
    previewClassName: 'h-40 w-full object-cover rounded',
    wrapperClassName: 'sm:col-span-2',
  },
}

export const SHOW_IMAGE_FIELDS = Object.values(SHOW_IMAGE_FIELD_MAP)
export const SHOW_IMAGE_KEYS = Object.keys(SHOW_IMAGE_FIELD_MAP)

export function createEmptyShowUploads() {
  return {
    poster: { file: null, preview: null },
    image: { file: null, preview: null },
    landscape: { file: null, preview: null },
  }
}

export function buildShowForm(show) {
  return {
    title: show?.title || '',
    category: show?.category || '',
    author: show?.author || '',
    information: show?.information || '',
    image_URL: show?.image_URL || '',
    poster_URL: show?.poster_URL || '',
    picture_personalURL: show?.picture_personalURL || '',
  }
}
