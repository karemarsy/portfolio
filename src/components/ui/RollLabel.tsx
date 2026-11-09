type Props = {
  label: string;
  /** Show an arrow that nudges forward on hover. */
  arrow?: boolean;
};

/** Button label that rolls up to a duplicate on hover. Use inside an element with `.btn`. */
export function RollLabel({ label, arrow = false }: Props) {
  return (
    <>
      <span className="roll">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
      {arrow && (
        <svg className="arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
}
