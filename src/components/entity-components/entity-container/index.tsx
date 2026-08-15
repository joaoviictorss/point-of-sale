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
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {filters}
        </div>
        {createButtonText && createButtonOnClick && (
          <Button
            className="w-full sm:w-auto"
            onClick={createButtonOnClick}
            type="button"
          >
            {createButtonText}
          </Button>
        )}
      </div>

      {children}
    </main>
  );
};
