"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    name: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li
                        key={step.name}
                        className={cn(
                            "relative",
                            stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
                        )}
                    >
                        {stepIdx < currentStep ? (
                            <>
                                <div
                                    className="absolute inset-0 flex items-center"
                                    aria-hidden="true"
                                >
                                    <div className="h-0.5 w-full bg-primary" />
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <span>{stepIdx + 1}</span>
                                </div>
                            </>
                        ) : stepIdx === currentStep ? (
                            <>
                                <div
                                    className="absolute inset-0 flex items-center"
                                    aria-hidden="true"
                                >
                                    <div className="h-0.5 w-full bg-border" />
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                                    <span className="text-primary">
                                        {stepIdx + 1}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="absolute inset-0 flex items-center"
                                    aria-hidden="true"
                                >
                                    <div className="h-0.5 w-full bg-border" />
                                </div>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
                                    <span className="text-muted-foreground">
                                        {stepIdx + 1}
                                    </span>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
