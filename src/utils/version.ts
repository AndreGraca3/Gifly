export type VersionStatus = "ok" | "minor-outdated" | "major-outdated";

export function parseVersion(v: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const [major = 0, minor = 0, patch = 0] = v
    .trim()
    .split(".")
    .map(Number);
  return { major, minor, patch };
}

export function compareVersions(
  current: string,
  required: string
): VersionStatus {
  const c = parseVersion(current);
  const r = parseVersion(required);

  if (c.major < r.major) return "major-outdated";
  if (c.major === r.major && c.minor < r.minor) return "minor-outdated";
  return "ok";
}
