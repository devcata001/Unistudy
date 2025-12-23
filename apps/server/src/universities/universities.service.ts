import { Injectable } from "@nestjs/common";
import {
  nigerianUniversities,
  University,
} from "../data/nigerian-universities.data";

interface FilterOptions {
  type?: "Federal" | "State" | "Private";
  state?: string;
  search?: string;
}

@Injectable()
export class UniversitiesService {
  getAll(filters?: FilterOptions) {
    let universities = [...nigerianUniversities];

    // Filter by type
    if (filters?.type) {
      universities = universities.filter((uni) => uni.type === filters.type);
    }

    // Filter by state
    if (filters?.state) {
      universities = universities.filter(
        (uni) => uni.state.toLowerCase() === filters.state!.toLowerCase()
      );
    }

    // Search by name or acronym
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      universities = universities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchLower) ||
          uni.acronym?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by name
    universities.sort((a, b) => a.name.localeCompare(b.name));

    return {
      count: universities.length,
      universities,
    };
  }

  getStats() {
    const federal = nigerianUniversities.filter(
      (uni) => uni.type === "Federal"
    ).length;
    const state = nigerianUniversities.filter(
      (uni) => uni.type === "State"
    ).length;
    const privateUniversities = nigerianUniversities.filter(
      (uni) => uni.type === "Private"
    ).length;

    const states = [...new Set(nigerianUniversities.map((uni) => uni.state))];

    return {
      total: nigerianUniversities.length,
      federal,
      state,
      private: privateUniversities,
      states: states.length,
      byState: this.getUniversitiesByState(),
    };
  }

  private getUniversitiesByState() {
    const byState: Record<string, number> = {};

    nigerianUniversities.forEach((uni) => {
      if (!byState[uni.state]) {
        byState[uni.state] = 0;
      }
      byState[uni.state]++;
    });

    return byState;
  }
}
