export function getConfigValueByKey(configs, key) {
  for (const config of configs || []) {
    if (config.key === key) {
      return config.value || {}
    }
  }

  return {}
}

export function createHeroItem() {
  return { title: '', subtitle: '', image: '', link: '' }
}

export function appendHeroItem(items) {
  return [...items, createHeroItem()]
}

export function updateHeroItemValue(items, index, field, value) {
  const nextItems = [...items]
  const currentItem = nextItems[index] || createHeroItem()
  nextItems[index] = { ...currentItem, [field]: value }
  return nextItems
}

export function removeHeroItemByIndex(items, index) {
  const nextItems = []

  for (let currentIndex = 0; currentIndex < items.length; currentIndex += 1) {
    if (currentIndex !== index) {
      nextItems.push(items[currentIndex])
    }
  }

  return nextItems
}

export function toggleShowSelectionItem(selection, showId) {
  const nextSelection = []
  let isSelected = false

  for (const selectedId of selection) {
    if (selectedId === showId) {
      isSelected = true
      continue
    }

    nextSelection.push(selectedId)
  }

  if (!isSelected) {
    nextSelection.push(showId)
  }

  return nextSelection
}
