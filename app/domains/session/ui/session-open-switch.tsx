import { Switch } from '@/domains/shared/components/ui/switch';

type Props = {
  sessionId: number;
  open: boolean;
  onToggle: (sessionId: number, open: boolean) => void;
};

export function SessionOpenSwitch({ sessionId, open, onToggle }: Props) {
  return (
    <Switch checked={open} onCheckedChange={(e) => onToggle(sessionId, e)} />
  );
}
