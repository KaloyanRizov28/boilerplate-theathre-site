"use client";

import { buttonBaseClass, selectClass } from '@/features/admin/constants'

export default function CastForm({
  editingId,
  form,
  shows,
  employees,
  employeeSearch,
  onShowChange,
  onEmployeeChange,
  onEmployeeSearchChange,
  onEmployeeIdsChange,
  onSubmit,
}) {
  const selectedEmployeeIds = (form.employeeIds || []).map(String)
  const filteredEmployees = [...employees]
    .sort((left, right) =>
      (left.name || '').localeCompare(right.name || '', 'bg', { sensitivity: 'base' })
    )
    .filter((employee) =>
      employeeSearch
        ? (employee.name || '').toLowerCase().includes(employeeSearch.toLowerCase())
        : true
    )

  function handleShowSelect(event) {
    onShowChange(event.target.value)
  }

  function handleEmployeeSelect(event) {
    onEmployeeChange(event.target.value)
  }

  function handleEmployeeSearch(event) {
    onEmployeeSearchChange(event.target.value)
  }

  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-medium text-theater-blue">
        {editingId ? 'Редакция на участник' : 'Управление на състава'}
      </h3>
      <form onSubmit={onSubmit} className="mb-4 grid items-start gap-6 sm:grid-cols-3">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-300">Спектакъл</label>
          <select
            value={form.idShow}
            onChange={handleShowSelect}
            required
            className={selectClass}
          >
            <option value="">Изберете спектакъл</option>
            {shows.map((show) => (
              <option key={show.id} value={show.id} className="text-theater-dark">
                {show.title}
              </option>
            ))}
          </select>
        </div>

        {editingId ? (
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-300">Служител</label>
            <select
              value={form.employeeId}
              onChange={handleEmployeeSelect}
              required
              className={selectClass}
            >
              <option value="">Изберете служител</option>
              {filteredEmployees.map((employee) => (
                <option key={employee.id} value={employee.id} className="text-theater-dark">
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-300">Служители</label>
            <input
              type="text"
              value={employeeSearch}
              onChange={handleEmployeeSearch}
              placeholder="Търсене по име"
              className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theater-blue/50"
              disabled={!form.idShow}
            />
            <div className="custom-scrollbar max-h-60 space-y-1 overflow-auto rounded-lg border border-white/10 bg-black/20 p-2 text-white">
              {filteredEmployees.map((employee) => {
                const employeeId = String(employee.id)
                const checked = selectedEmployeeIds.includes(employeeId)

                return (
                  <label
                    key={employee.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      checked
                        ? 'bg-theater-blue/20 text-theater-blue'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-theater-blue focus:ring-offset-gray-900"
                      value={employee.id}
                      disabled={!form.idShow}
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onEmployeeIdsChange(
                            Array.from(new Set([...selectedEmployeeIds, employeeId]))
                          )
                          return
                        }

                        onEmployeeIdsChange(
                          selectedEmployeeIds.filter((currentId) => currentId !== employeeId)
                        )
                      }}
                    />
                    <span className="flex-1 truncate">{employee.name}</span>
                  </label>
                )
              })}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Избрани:{' '}
              <span className="font-medium text-white">{selectedEmployeeIds.length}</span>
            </div>
          </div>
        )}

        <div className="flex h-full items-end">
          <button
            type="submit"
            className={`${buttonBaseClass} mt-6 h-[46px] w-full text-white shadow-lg shadow-green-900/20 sm:mt-0 ${
              editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {editingId ? 'Обнови' : 'Запази състав'}
          </button>
        </div>
      </form>
    </div>
  )
}
