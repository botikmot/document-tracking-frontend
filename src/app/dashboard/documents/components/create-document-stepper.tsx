'use client';

import { cn } from '@/lib/utils';
import { steps } from '@/lib/constants';

export function CreateDocumentSteps({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="space-y-8">
      {steps.map((step) => {
        const active =
          currentStep === step.id;

        const completed =
          currentStep > step.id;

        return (
          <div
            key={step.id}
            className="flex gap-4"
          >
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold
                ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : completed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 bg-white text-slate-500'
                }
              `}
            >
              {step.id}
            </div>

            <div>
              <div
                className={`text-sm font-semibold ${
                  active
                    ? 'text-blue-600'
                    : 'text-slate-700'
                }`}
              >
                {step.title}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}