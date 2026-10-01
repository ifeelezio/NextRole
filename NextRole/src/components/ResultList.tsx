interface ResultListProps {
  title: string;
  items: string[];
  ordered?: boolean;
}

export default function ResultList({ title, items, ordered = false }: ResultListProps) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <section>
      <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing to show.</p>
      ) : (
        <Tag className={`space-y-1.5 pl-5 text-sm text-slate-700 ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((item, index) => (
            <li key={`${index}-${item.slice(0, 20)}`}>{item}</li>
          ))}
        </Tag>
      )}
    </section>
  );
}
