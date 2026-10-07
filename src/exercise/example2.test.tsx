import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { data } from "../data/MOCK_DATA";
import { useDeploymentFilters } from "./example2";

describe("useDeploymentFilters", () => {
  it("returns all deployments when the search is empty", () => {
    const { result } = renderHook(() => useDeploymentFilters(data));

    expect(result.current.search).toBe("");
    expect(result.current.filteredDeployments).toEqual(data);
  });

  it("filters application names without case sensitivity", () => {
    const { result } = renderHook(() => useDeploymentFilters(data));

    act(() => {
      result.current.setSearch("pAyMeNtS");
    });

    expect(
      result.current.filteredDeployments.map((deployment) => deployment.application)
    ).toEqual(["Payments API"]);
  });

  it("returns no deployments when there is no match", () => {
    const { result } = renderHook(() => useDeploymentFilters(data));

    act(() => {
      result.current.setSearch("no matching application");
    });

    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("filters deployments by status", () => {
    const { result } = renderHook(() => useDeploymentFilters(data));

    act(() => {
      result.current.setStatus("Completed");
    });

    expect(result.current.filteredDeployments).toHaveLength(3);
    expect(
      result.current.filteredDeployments.every(
        (deployment) => deployment.status === "Completed",
      ),
    ).toBe(true);
  });
});