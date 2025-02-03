import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import {
  Button,
  type ButtonProps,
} from '@/domains/shared/components/ui/button';
import { cn } from '@/domains/shared/utils/tw-utils';

export function FormSubmitButton(props: ButtonProps) {
  const { children, ...rest } = props;
  const { pending } = useFormStatus();

  return (
    <Button
      {...rest}
      disabled={pending}
      className={cn({ disabled: pending })}
      type='submit'
    >
      {pending && <Loader2 className='animate-spin' />}
      {children}
    </Button>
  );
}
