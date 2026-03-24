"use client";

export default function CastTable({
  items,
  filterShowId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/10 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Спектакъл</th>
            <th className="p-4">Служител</th>
            <th className="p-4 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items
            .filter((item) => !filterShowId || String(item.idShow) === String(filterShowId))
            .map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-gray-400">{item.id}</td>
                <td className="p-4 font-medium text-white">{item.shows?.title}</td>
                <td className="p-4 text-gray-300">{item.employees?.name}</td>
                <td className="space-x-3 p-4 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="font-medium text-theater-blue transition-colors hover:text-white"
                  >
                    Редакция
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="font-medium text-red-400 transition-colors hover:text-red-300"
                  >
                    Премахни
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
