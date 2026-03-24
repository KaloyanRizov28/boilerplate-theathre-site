export function getAssignedEmployeeIds(items, showId) {
  const assignedEmployeeIds = []

  for (const item of items) {
    if (String(item.idShow) === String(showId)) {
      assignedEmployeeIds.push(String(item.employeeId))
    }
  }

  return assignedEmployeeIds
}

export function computeCastChanges(items, showId, employeeIds) {
  const assignedSet = new Set(getAssignedEmployeeIds(items, showId))
  const selectedSet = new Set((employeeIds || []).map(String))
  const toAdd = []
  const toRemove = []

  for (const employeeId of selectedSet) {
    if (!assignedSet.has(employeeId)) {
      toAdd.push(employeeId)
    }
  }

  for (const employeeId of assignedSet) {
    if (!selectedSet.has(employeeId)) {
      toRemove.push(employeeId)
    }
  }

  return { toAdd, toRemove }
}

export function buildCastPayload(showId, employeeIds) {
  const payload = []

  for (const employeeId of employeeIds) {
    payload.push({ idShow: showId, employeeId })
  }

  return payload
}

export function findShowTitleById(shows, showId) {
  for (const show of shows) {
    if (String(show.id) === String(showId)) {
      return show.title
    }
  }

  return null
}
