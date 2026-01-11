import { useState, useCallback, useMemo } from 'react';

export const useArtworkSelection = () => {
    const [bulkCount, setBulkCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [deselectedIds, setDeselectedIds] = useState<Set<number>>(new Set());

    // Check if a row is selected
    const isRowSelected = useCallback((id: number, globalIndex: number) => {
        if (selectedIds.has(id)) return true;
        if (deselectedIds.has(id)) return false;
        return globalIndex < bulkCount;
    }, [bulkCount, selectedIds, deselectedIds]);

    // Toggle selection for a specific row
    const toggleRow = useCallback((id: number, globalIndex: number) => {
        // Determine current state based o existing logic
        const currentlySelected = selectedIds.has(id) || (!deselectedIds.has(id) && globalIndex < bulkCount);

        // We need strict logic to maintain the count invariant:
        // selectedIds contains ONLY items >= bulkCount
        // deselectedIds contains ONLY items < bulkCount

        if (currentlySelected) {
            // We are Deselecting
            if (globalIndex < bulkCount) {
                // It was implicitly selected, so we must explicitly deselect it
                setDeselectedIds(prev => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                });
            } else {
                // It was explicitly selected (outside range), so remove from selectedIds
                setSelectedIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        } else {
            // We are Selecting
            if (globalIndex < bulkCount) {
                // It was explicitly deselected, so remove from deselectedIds (re-enabling implicit selection)
                setDeselectedIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            } else {
                // It is outside range, so explicitly select it
                setSelectedIds(prev => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                });
            }
        }
    }, [bulkCount, selectedIds, deselectedIds]); // dependencies fixed to state

    // Handle "Select N" logic
    const selectBulk = useCallback((count: number) => {
        setBulkCount(count);
        // Reset specific overrides when applying a new bulk selection
        setSelectedIds(new Set());
        setDeselectedIds(new Set());
    }, []);

    const totalSelectedCount = useMemo(() => {
        const s = selectedIds.size;
        const d = deselectedIds.size;
        // Invariant: selectedIds are always additive to bulkCount, deselectedIds are always subtractive
        // BUT we must ensure selectedIds doesn't contain items < bulkCount (handled by toggleRow)
        // and deselectedIds doesn't contain items >= bulkCount (handled by toggleRow)
        // If bulkCount reduces, we might have "zombie" deselectedIds that are now >= bulkCount?
        // Or if bulkCount increases, we might have selectedIds that are now < bulkCount?
        // We clear sets on `selectBulk`, so this only happens if we change bulkCount without clearing?
        // `selectBulk` clears them. So we are safe.

        return Math.max(0, bulkCount - d + s);
    }, [bulkCount, selectedIds.size, deselectedIds.size]);

    return {
        bulkCount,
        selectedIds,
        deselectedIds,
        isRowSelected,
        toggleRow,
        selectBulk,
        totalSelectedCount
    };
};
