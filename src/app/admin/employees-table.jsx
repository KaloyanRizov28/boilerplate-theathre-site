"use client";

export default function EmployeesTable({ items, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/10 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Име</th>
            <th className="p-4">Роля</th>
            <th className="p-4 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-mono text-gray-400">{item.id}</td>
              <td className="flex items-center gap-3 p-4 font-medium text-white">
                {item.profile_picture_URL && (
                  <img
                    src={item.profile_picture_URL}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                {item.name}
              </td>
              <td className="p-4 text-gray-300">{item.role}</td>
              <td className="space-x-4 p-4 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="font-medium text-theater-blue transition-colors hover:text-white"
                >
                  Редакция
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="font-medium text-red-400 transition-colors hover:text-red-300"
                >
                  Изтрий
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
