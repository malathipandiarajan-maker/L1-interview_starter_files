/**
 * ============================================================================
 * Exercise 3 - Deployment Queue
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Congratulations!
 *
 * The DeploymentCard component and search functionality have been completed.
 *
 * Your next task is to build the Deployment Queue page by integrating the
 * previous exercises.
 *
 * ============================================================================
 *
 * Requirements
 *
 * Build a Deployment Queue page using the supplied mock API response.
 *
 * The page should display all deployments using the DeploymentCard component
 * created in Exercise 1.
 *
 * Use the custom hook created in Exercise 2 for searching deployments.
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * 1. Fetch deployments using React Query.
 *
 * 2. Display all deployments.
 *
 * 3. Search deployments by Application Name.
 *
 * 4. Display the following summary:
 *
 *      Total Deployments
 *
 * 5. Add a Status filter.
 *
 *      All
 *      Pending
 *      In Progress
 *      Completed
 *      Failed
 *
 * 6. Display an Empty State when no deployments match the search/filter.
 *
 * 7. Display a Loading State while data is loading.
 *
 * 8. Display an Error State when the request fails.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • React Query
 *
 * • TypeScript
 *
 * • Reusable Components
 *
 * • Clean Folder Structure
 *
 * • Avoid duplicated logic
 *
 * • Use the custom hook from Exercise 2
 *
 * ============================================================================
 *
 * Bonus (Optional)
 *
 * If time permits, implement one or more of the following:
 *
 * • Sort deployments by Scheduled Date
 *
 * • Display deployment counts grouped by Status
 *
 * • Display the number of filtered deployments
 *
 * • Highlight the matched search text
 *
 * ============================================================================
 *
 * Notes
 *
 * • You may create additional components if needed.
 *
 * • You may extend the custom hook created in Exercise 2.
 *
 * • Focus on clean architecture over visual appearance.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ React
 * ✓ React Query
 * ✓ TypeScript
 * ✓ Component Composition
 * ✓ Hooks
 * ✓ State Management
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeployments } from "@/api/diploymentApi";
import DeploymentCard from "./example1";
import { useDeploymentFilters } from "./example2";
import type { Deployment } from "@/types/deployment";

const statuses = ["All", "Pending", "In Progress", "Completed", "Failed"];

export default function Example3() {
  const queryClient = useQueryClient();
  const {
    data: deployments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });

  const { search, setSearch, status, setStatus, filteredDeployments } =
    useDeploymentFilters(deployments);

  const handleAdvance = (deployment: Deployment) => {
    if (deployment.status === "Completed") return;

    const nextStatus: Deployment["status"] =
      deployment.status === "Pending" ? "In Progress" : "Completed";

    queryClient.setQueryData<Deployment[]>(["deployments"], (current = []) =>
      current.map((item) =>
        item.id === deployment.id ? { ...item, status: nextStatus } : item,
      ),
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-6" role="status">
        Loading deployments...
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen p-6" role="alert">
        Could not load deployments: {error.message}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-900 p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold">🚀 Deployment Queue</h1>

            <p className="mt-1 text-sm text-slate-300">
              Monitor deployment requests across environments.
            </p>
          </div>

          <div className="rounded-md bg-slate-800 px-8 py-3 text-center">
            <p className="text-xs text-slate-300">ACTIVE DEPLOYMENTS</p>

            <p className="text-2xl font-semibold">{deployments.length}</p>
          </div>
        </header>
        <section className="space-y-4 rounded-lg border bg-white p-5">
          <label
            className="block text-md font-medium"
            htmlFor="deployment-search"
          >
            Search & Filters
          </label>
          <input
            id="deployment-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by application name..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <div aria-label="Filter by status" className="flex flex-wrap gap-2">
            {statuses.map((filterStatus) => (
              <button
                key={filterStatus}
                type="button"
                aria-pressed={status === filterStatus}
                onClick={() => setStatus(filterStatus)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  status === filterStatus
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-900 hover:bg-slate-100"
                }`}
              >
                {filterStatus}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredDeployments.length} of {deployments.length}{" "}
            deployments
          </p>
        </section>

        {filteredDeployments.length === 0 ? (
          <p
            className="rounded-lg border bg-white p-8 text-center"
            role="status"
          >
            No deployments match your search and status filter.
          </p>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeployments.map((deployment) => (
              <DeploymentCard
                key={deployment.id}
                deployment={deployment}
                onAdvance={handleAdvance}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
