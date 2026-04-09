import { cn } from "../lib/utils";
import { statusBadge, statusBadgeDefault } from "../lib/status-colors";
import { useI18n } from "@/i18n";

export function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0",
        statusBadge[status] ?? statusBadgeDefault
      )}
    >
      {t(status.replace("_", " "))}
    </span>
  );
}
