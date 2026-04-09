import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const next = locale === "en" ? "es" : "en";
  const label = locale === "en" ? "ES" : "EN";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground shrink-0 text-[11px] font-bold"
          onClick={() => setLocale(next)}
        >
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {locale === "en" ? t("Switch to Spanish") : t("Switch to English")}
      </TooltipContent>
    </Tooltip>
  );
}
