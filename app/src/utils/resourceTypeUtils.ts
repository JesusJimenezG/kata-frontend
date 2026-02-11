const RESOURCE_TYPE_CONFIG: Record<string, { label: string; emoji: string }> = {
  ROOM: { label: "Room", emoji: "🏠" },
  CONFERENCE_ROOM: { label: "Conference Room", emoji: "🏢" },
  SHARED_TECH_EQUIPMENT: { label: "Shared Tech Equipment", emoji: "💻" },
  BILL_COUNTING_MACHINE: { label: "Bill Counting Machine", emoji: "💵" },
  VIP_ROOM: { label: "VIP Room", emoji: "⭐" },
  CORPORATE_VEHICLE: { label: "Corporate Vehicle", emoji: "🚗" },
};

export function formatResourceType(name: string): string {
  const config = RESOURCE_TYPE_CONFIG[name];
  if (config) {
    return `${config.emoji} ${config.label}`;
  }
  // Fallback: convert SNAKE_CASE to Title Case
  const label = name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `📦 ${label}`;
}

export function getResourceTypeEmoji(name: string): string {
  return RESOURCE_TYPE_CONFIG[name]?.emoji ?? "📦";
}
