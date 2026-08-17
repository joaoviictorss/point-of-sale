import { Button } from '@/components/shadcn';

type EntityContainerProps = {
  children: React.ReactNode;
  filters?: React.ReactNode;
} & (
    | { primaryActionButtonText: string; primaryActionButtonOnClick: () => void }
    | { primaryActionButtonText?: never; primaryActionButtonOnClick?: never }
  ) & (
    | { secondaryActionButtonText: string; secondaryActionButtonOnClick: () => void }
    | { secondaryActionButtonText?: never; secondaryActionButtonOnClick?: never }
  );

export const EntityContainer = ({
  children,
  filters,
  primaryActionButtonText,
  primaryActionButtonOnClick,
  secondaryActionButtonText,
  secondaryActionButtonOnClick
}: EntityContainerProps) => {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {filters}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {secondaryActionButtonText && secondaryActionButtonOnClick && (
            <Button
              className="w-full sm:w-auto"
              onClick={secondaryActionButtonOnClick}
              variant={"outline"}
            >
              {secondaryActionButtonText}
            </Button>
          )}

          {primaryActionButtonText && primaryActionButtonOnClick && (
            <Button
              className="w-full sm:w-auto"
              onClick={primaryActionButtonOnClick}
              type="button"
            >
              {primaryActionButtonText}
            </Button>
          )}
        </div>
      </div>

      {children}
    </main>
  );
};
