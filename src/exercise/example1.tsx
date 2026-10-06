

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Deployment } from "@/types/deployment";

interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: (deployment: Deployment) => void;
}

const getPriorityColor = (priority: string) => {
  if (priority === "Critical") return "border-l-red-500";
  if (priority === "High") return "border-l-orange-500";
  if (priority === "Medium") return "border-l-sky-500";

  return "border-l-green-500";
};

const getStatusColor = (status: string) => {
  if (status === "Pending") {
    return "border-yellow-200 bg-yellow-100 text-yellow-700";
  }

  if (status === "In Progress") {
    return "border-blue-200 bg-blue-100 text-blue-700";
  }

  return "border-green-200 bg-green-100 text-green-700";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const DeploymentCard = ({ deployment, onAdvance }: DeploymentCardProps) => {
  const actionText =
    deployment.status === "Pending"
      ? "Advance to In Progress"
      : deployment.status === "In Progress"
        ? "Advance to Completed"
        : "Completed";

  return (
    <Card className={`border-l-4 ${getPriorityColor(deployment.priority)}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{deployment.application}</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {deployment.version}
            </p>
          </div>

          <Badge variant="outline">{deployment.environment}</Badge>
        </div>

        <div className="pt-3">
          <p className="text-xs text-muted-foreground">Deployment ID</p>

          <p className="mt-1 text-sm font-medium">{deployment.id}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Status and Priority */}
        <div className="flex items-center justify-between border-b pb-5">
          <Badge
            variant="outline"
            className={getStatusColor(deployment.status)}
          >
            {deployment.status}
          </Badge>

          <p className="text-sm">
            Priority <span className="font-medium">{deployment.priority}</span>
          </p>
        </div>

        {/* Deployment Details */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Requested By</p>

            <p className="mt-1 text-sm font-medium">{deployment.requestedBy}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Scheduled</p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(deployment.scheduledAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Region</p>

            <p className="mt-1 text-sm font-medium">{deployment.region}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Environment</p>

            <p className="mt-1 text-sm font-medium">{deployment.environment}</p>
          </div>
        </div>

        {deployment.status === "Completed" ? (
          <button
            type="button"
            disabled
            className="w-full rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            ✓ {actionText}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAdvance?.(deployment)}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {actionText}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentCard;
