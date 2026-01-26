import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface PopupCustomProps {
  title: string;
  description: string;
  actionText: string;
  cancelText: string;
  onAction: () => void;
  triggerElement?: React.ReactNode;
}

export function PopupCustom({ title, description, actionText, cancelText, onAction, triggerElement }: PopupCustomProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerElement ? triggerElement : <Button variant="outline">Open</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
