function isTechnical(roleRaw) {
  const role = String(roleRaw || '').toLowerCase()

  if (!role) {
    return false
  }

  return (
    /техничес/.test(role) ||
    /освет/.test(role) ||
    /звук/.test(role) ||
    /сценич/.test(role) ||
    /сценограф/.test(role) ||
    /костюм/.test(role) ||
    /реквизит/.test(role) ||
    /машинист/.test(role) ||
    /монтаж/.test(role) ||
    /видео|фото/.test(role) ||
    /техник/.test(role)
  )
}

function isAdministrative(roleRaw) {
  const role = String(roleRaw || '').toLowerCase()

  if (!role) {
    return false
  }

  return (
    /админист/.test(role) ||
    /офис/.test(role) ||
    /билет/.test(role) ||
    /финанс/.test(role) ||
    /маркет/.test(role) ||
    /комуникац/.test(role) ||
    /hr|човешки ресурси/.test(role) ||
    /счетовод/.test(role) ||
    /деловод|кадри/.test(role)
  )
}

function isCreative(roleRaw) {
  const role = String(roleRaw || '').toLowerCase()

  if (!role) {
    return false
  }

  return (
    /актьор|actor/.test(role) ||
    /режис/.test(role) ||
    /сценар|драматург|writer|playwright/.test(role) ||
    /музик|композитор|music/.test(role) ||
    /хореограф/.test(role)
  )
}

export function groupEmployeesByRole(employees = []) {
  const people = employees || []

  return {
    technical: people.filter((person) => isTechnical(person.role)),
    administrative: people.filter((person) => isAdministrative(person.role)),
    creative: people.filter(
      (person) =>
        isCreative(person.role) ||
        (!isTechnical(person.role) && !isAdministrative(person.role))
    ),
  }
}
