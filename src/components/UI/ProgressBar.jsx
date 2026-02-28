/**
 * ProgressBar — animated progress bar that changes color near the limit.
 * @param {number} pct    - 0–100
 * @param {string} [color] - override color
 * @param {number} [height] - bar height in px (default 6)
 */
export default function ProgressBar({ pct, color, height = 6 }) {
  const resolvedColor =
    color ||
    (pct > 90 ? "var(--red)" : pct > 70 ? "var(--amber)" : "var(--green)");

  return (
    <div className="progress-track" style={{ height }}>
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: resolvedColor }}
      />
    </div>
  );
}
