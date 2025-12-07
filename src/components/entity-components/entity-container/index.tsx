import { Button } from "@/components/Shadcn";

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
    <main className="flex flex-col gap-6 px-4 py-6">
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
