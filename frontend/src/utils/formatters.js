export function formatNumber(value, suffix = "") {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "--";
  }
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`;
}

export function statusTone(status) {
  if (status === "UP") return "healthy";
  if (status === "WARNING") return "warning";
  return "critical";
}

export function severityClass(severity) {
  if (severity === "critical") return "text-danger bg-danger/10 border-danger/30";
  if (severity === "high") return "text-warning bg-warning/10 border-warning/30";
  return "text-cyanline bg-cyanline/10 border-cyanline/30";
}
