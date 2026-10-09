import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDeploymentFilters } from "./example2";

const deployments = [
  {
    id: "DEP-1001",
    application: "Customer Portal",
    version: "v4.2.1",
    environment: "Production",
    status: "Pending",
    requestedBy: "John Smith",
    requestedAt: "2026-07-18T09:30:00Z",
    scheduledAt: "2026-07-20T10:00:00Z",
    region: "US-East",
    priority: "High",
  },
  {
    id: "DEP-1002",
    application: "Payments API",
    version: "v2.8.0",
    environment: "QA",
    status: "In Progress",
    requestedBy: "Emily Davis",
    requestedAt: "2026-07-18T10:15:00Z",
    scheduledAt: "2026-07-20T11:30:00Z",
    region: "Europe",
    priority: "Critical",
  },
  {
    id: "DEP-1003",
    application: "Inventory Service",
    version: "v5.1.3",
    environment: "Development",
    status: "Completed",
    requestedBy: "Michael Lee",
    requestedAt: "2026-07-17T13:20:00Z",
    scheduledAt: "2026-07-19T09:00:00Z",
    region: "India",
    priority: "Medium",
  },
];

describe("useDeploymentFilters", () => {
  it("returns all deployments when the search is empty", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    expect(result.current.search).toBe("");
    expect(result.current.filteredDeployments).toHaveLength(3);
  });

  it("filters deployments by application name case-insensitively", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("payments api");
    });

    expect(result.current.search).toBe("payments api");
    expect(result.current.filteredDeployments).toEqual([deployments[1]]);
  });

  it("matches partial search text", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("service");
    });

    expect(result.current.filteredDeployments).toEqual([
      deployments[2],
    ]);
  });
});
