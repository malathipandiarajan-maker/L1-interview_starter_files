

/**
 * ============================================================================
 * Exercise 1 - Deployment Card
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Your team is building an internal Deployment Queue application used by
 * Release Engineers to monitor application deployments.
 *
 * A mock API response has been provided in src/data/MOCK_DATA.ts.
 *
 * In this exercise, your task is to build a reusable DeploymentCard component.
 *
 * ============================================================================
 *
 * ## Requirements

### 1. Component Setup

- Create a `DeploymentCard` component.
- Keep the provided imports unchanged.
- Use React with TypeScript.
- Use the existing Shadcn UI components:
  - Card
  - Badge
  - Button
  - Separator

---
### 2. Deployment Interface

Create the `Deployment` interface with the mockdata properties:
make sure 
environment: "Production" | "QA" | "Development" | "Staging";
status: "Pending" | "In Progress" | "Completed";
priority: "Low" | "Medium" | "High" | "Critical";



 * ============================================================================
 *
 * UI Requirements
 *
 * • Use the provided shadcn/ui components where appropriate.
 *
 * • Environment and Status should be displayed using badges.
 *
 * • Color the left border of the card based on priority.
 *   Priority values in the data are: Low, Medium, High, and Critical.
 *   Choose a distinct color for each priority.
 *
 * • Display a "advance to [next status]" button at the bottom of the card.
 *
 * • Use appropriate spacing and visual hierarchy.
 *
 * • The component should remain responsive.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use TypeScript.
 *
 * • Define appropriate interfaces/types.
 *
 * • Keep the component reusable.
 *
 * • Do not hardcode values.
 *
 * • Avoid unnecessary duplication.
 *
 * • Write clean, maintainable code.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * We will evaluate:
 *
 * ✓ React Fundamentals
 * ✓ Component Composition
 * ✓ TypeScript
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 *
 * Note
 *
 * This exercise focuses only on the DeploymentCard component.
 *
 * Additional requirements will be introduced in later exercises.
 *
 * ============================================================================
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type DeploymentEnvironment =
  | "Production"
  | "QA"
  | "Development"
  | "Staging";

export type DeploymentStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Failed";

export type DeploymentPriority = "Low" | "Medium" | "High" | "Critical";

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: DeploymentPriority;
}

export interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: (deployment: Deployment) => void;
}

const priorityStyles: Record<DeploymentPriority, string> = {
  Low: "border-l-emerald-500",
  Medium: "border-l-amber-500",
  High: "border-l-orange-500",
  Critical: "border-l-red-600",
};

const nextStatusMap: Record<DeploymentStatus, DeploymentStatus> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: "Completed",
  Failed: "Pending",
};

const statusVariant: Record<
  DeploymentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Pending: "secondary",
  "In Progress": "default",
  Completed: "outline",
  Failed: "destructive",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const DeploymentCard = ({ deployment, onAdvance }: DeploymentCardProps) => {
  const nextStatus = nextStatusMap[deployment.status];
  const isCompleted = deployment.status === "Completed";

  return (
    <Card
      className={`border-l-4 ${priorityStyles[deployment.priority]} bg-card shadow-sm`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {deployment.application}
            </CardTitle>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{deployment.id}</span>
              <Separator orientation="vertical" className="h-3" />
              <span>{deployment.version}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant[deployment.status]}>
              {deployment.status}
            </Badge>
            <Badge variant="outline">{deployment.environment}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid gap-2 text-sm text-foreground/90">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Region</span>
            <span>{deployment.region}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Requested by</span>
            <span>{deployment.requestedBy}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Scheduled</span>
            <span>{formatDate(deployment.scheduledAt)}</span>
          </div>
        </div>

        <CardDescription className="text-xs text-muted-foreground">
          Requested at {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(new Date(deployment.requestedAt))}
        </CardDescription>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant={isCompleted ? "secondary" : "default"}
          className="w-full"
          onClick={() => onAdvance?.(deployment)}
          disabled={isCompleted}
        >
          {isCompleted ? "Completed" : `Advance to ${nextStatus}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
