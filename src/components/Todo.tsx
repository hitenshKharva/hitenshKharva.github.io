/** Visible placeholder for content that hasn't been provided yet. */
export function Todo({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-dashed border-todo px-1.5 py-0.5 font-mono text-[0.8em] leading-snug text-todo">
      <span className="font-semibold">TODO</span>
      <span>{children}</span>
    </span>
  );
}

/** Render a value, or a TODO badge when it is missing. */
export function OrTodo({ value, label }: { value: string | null | undefined; label: string }) {
  return value ? <>{value}</> : <Todo>{label}</Todo>;
}
