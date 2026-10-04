export default function SkillList({ skills }: { skills: string[] }) {
  if (skills.length === 0) return <p className="text-sm text-slate-500">None found.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <li
          key={`${skill}-${index}`}
          className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-800"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
