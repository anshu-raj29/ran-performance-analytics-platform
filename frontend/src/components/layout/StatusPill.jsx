import { statusTone } from "../../utils/formatters.js";

export default function StatusPill({ status }) {
  const tone = statusTone(status);
  return <span className={`status-pill status-${tone}`}>{status}</span>;
}
