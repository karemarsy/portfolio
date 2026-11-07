type Props = {
  label: string;
  /** Show the three-bar glyph that spreads apart on hover. */
  bars?: boolean;
};

/** Button label that rolls up to a duplicate on hover. Use inside an element with `.btn`. */
export function RollLabel({ label, bars = false }: Props) {
  return (
    <>
      <span className="roll">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
      {bars && (
        <span className="bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </>
  );
}
