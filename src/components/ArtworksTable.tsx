import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchArtworks } from '../services/api';
import type { Artwork } from '../types';
import { useArtworkSelection } from '../hooks/useArtworkSelection';
import { SelectionOverlay } from './SelectionOverlay';

export const ArtworksTable = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 12,
        page: 1
    });

    const {
        isRowSelected,
        toggleRow,
        selectBulk,
        totalSelectedCount
    } = useArtworkSelection();

    // Fetch data when pagination changes
    useEffect(() => {
        loadData();
    }, [lazyState]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchArtworks(lazyState.page, lazyState.rows);
            setArtworks(data.data);
            setTotalRecords(data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onPage = (event: any) => {
        setLazyState({
            first: event.first,
            rows: event.rows,
            page: event.page + 1
        });
    };
    const onSelectionChange = (e: any) => {
        const newSelection = e.value as Artwork[]; // Array of selected objects on this page
        const newSelectedIds = new Set(newSelection.map(r => r.id));

        // Iterate current page artworks
        artworks.forEach((row, index) => {
            const globalIndex = (lazyState.page - 1) * lazyState.rows + index;
            const currentlySelected = isRowSelected(row.id, globalIndex);

            if (newSelectedIds.has(row.id) && !currentlySelected) {
                // Must have been selected
                toggleRow(row.id, globalIndex);
            } else if (!newSelectedIds.has(row.id) && currentlySelected) {
                // Must have been deselected
                toggleRow(row.id, globalIndex);
            }
        });
    };

    // Custom row selection handler
    const handleCustomSelect = (count: number) => {
        selectBulk(count);
    };

    return (
        <div className="card p-6 text-white">
            <div className="flex align-items-center mb-4 px-2">
                <div className="flex align-items-center gap-6">
                    <span className="text-xl pb-2">
                        Selected: <span className="font-bold text-teal-400">{totalSelectedCount}</span> rows
                    </span>
                    <SelectionOverlay onSubmit={handleCustomSelect} />
                </div>
            </div>

            <DataTable
                value={artworks}
                lazy
                dataKey="id"
                paginator
                first={lazyState.first}
                rows={lazyState.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                loading={loading}
                selection={artworks.filter(row => isRowSelected(row.id, (lazyState.page - 1) * lazyState.rows + artworks.indexOf(row))) as any}
                onSelectionChange={onSelectionChange}
                selectAll={false}
                tableStyle={{ minWidth: '50rem' }}
                className="p-datatable-sm"
                emptyMessage="No artworks found."
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

                <Column field="title" header="Title" style={{ width: '20%' }}></Column>
                <Column field="place_of_origin" header="Origin" style={{ width: '15%' }}></Column>
                <Column field="artist_display" header="Artist" style={{ width: '25%' }}></Column>
                <Column field="inscriptions" header="Inscriptions" style={{ width: '20%' }}
                    body={(rowData) => <span className="text-sm text-gray-400 block truncate" style={{ maxWidth: '200px' }} title={rowData.inscriptions || 'N/A'}>{rowData.inscriptions || 'N/A'}</span>}
                ></Column>
                <Column field="date_start" header="Start" style={{ width: '10%' }}></Column>
                <Column field="date_end" header="End" style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    );
};
