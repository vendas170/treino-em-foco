import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Voltar",
  onConfirm,
  destructive,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[22rem] rounded-3xl border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-3xl font-extrabold uppercase italic leading-none">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription className="text-muted-foreground">{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive
                ? "h-12 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "h-12 rounded-xl bg-primary font-display text-lg font-bold uppercase tracking-wider text-primary-foreground glow-md hover:bg-primary-glow"
            }
          >
            {confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0 h-12 rounded-xl border-border bg-surface-raised text-foreground hover:bg-secondary">
            {cancelLabel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
