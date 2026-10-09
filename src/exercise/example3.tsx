import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getDeployments } from "@/api/diploymentApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import DeploymentCard, { type Deployment, type DeploymentStatus } from "./DeploymentCard";
import { useDeploymentFilters } from "./example2";

const statusOptions: Array<"All" | DeploymentStatus> = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Failed",
];

export default function Example3() {
  const [statusFilter, setStatusFilter] = useState<"All" | DeploymentStatus>("All");

  const {
    data: deployments = [],
    isLoading,
    error,
  } = useQuery<Deployment[]>({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });

  const { search, setSearch, filteredDeployments } = useDeploymentFilters(deployments);

  const visibleDeployments = useMemo(
    () =>
      filteredDeployments.filter(
        (deployment) =>
          statusFilter === "All" || deployment.status === statusFilter,
      ),
    [filteredDeployments, statusFilter],
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Loading deployments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center text-destructive">
          Failed to load deployments.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Deployment Queue
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Release Overview</h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">Total Deployments: {deployments.length}</Badge>
          <Badge variant="secondary">Filtered: {visibleDeployments.length}</Badge>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          aria-label="Search deployments"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by application name"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring md:max-w-xs"
        />

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status}
              type="button"
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {visibleDeployments.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center text-muted-foreground">
          No deployments match the current search and filter settings.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleDeployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      )}
    </div>
  );
}