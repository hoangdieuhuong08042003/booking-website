import { DateFilter, SatisfactionFilter, ModeFilter } from "@/types";
import { DEFAULT_FILTERS } from "@/lib/constants/filter-options";

interface FilterState {
    dateFilter?: DateFilter;
    domainFilter?: string;
    satisfactionFilter?: SatisfactionFilter;
    modeFilter?: ModeFilter;
}

export function calculateActiveFilterCount(filters: FilterState): number {
    return [
        filters.dateFilter && filters.dateFilter !== DEFAULT_FILTERS.dateFilter,
        filters.domainFilter && filters.domainFilter !== DEFAULT_FILTERS.domainFilter,
        filters.satisfactionFilter && filters.satisfactionFilter !== DEFAULT_FILTERS.satisfactionFilter,
        filters.modeFilter && filters.modeFilter !== DEFAULT_FILTERS.modeFilter,
    ].filter(Boolean).length;
}

