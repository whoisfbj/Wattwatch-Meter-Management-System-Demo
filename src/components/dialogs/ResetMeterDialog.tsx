import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Meter } from "@/types";

export function ResetMeterDialog({
  meter,
  onCancel,
  onConfirm,
}: {
  meter: Meter | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={meter !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset meter?</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset meter {meter?.id}? This is a
            simulated action and will not affect a physical meter.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={onConfirm}>
            Confirm reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}