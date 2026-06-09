'use client';

import { Button } from '@/components/ui/button';

interface Props {
  currentStep: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function CreateDocumentFooter({
  currentStep,
  loading,
  onBack,
  onNext,
  onSubmit,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t pt-6">
      <div className="text-sm text-slate-500">
        Step {currentStep} of 4
      </div>

      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
        )}

        {currentStep < 4 ? (
          <Button onClick={onNext}>
            Next
          </Button>
        ) : (
          <Button
            disabled={loading}
            onClick={onSubmit}
          >
            {loading
              ? 'Creating...'
              : 'Create Document'}
          </Button>
        )}
      </div>
    </div>
  );
}