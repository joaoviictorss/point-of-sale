import { Button } from '@/components/shadcn';

type EntityContainerProps = {
  children: React.ReactNode;
  filters?: React.ReactNode;
} & (
  | { createButtonText: string; createButtonOnClick: () => void }
  | { createButtonText?: never; createButtonOnClick?: never }
);

export const EntityContainer = ({
  children,
  filters,
  createButtonText,
  createButtonOnClick,
}: EntityContainerProps) => {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">{filters}</div>
        {createButtonText && createButtonOnClick && (
          <Button onClick={createButtonOnClick} type="button">
            {createButtonText}
          </Button>
        )}
      </div>

      {children}
    </main>
  );
};
