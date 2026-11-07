export function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-[13px] font-medium leading-none">
          {tag}
        </li>
      ))}
    </ul>
  );
}
