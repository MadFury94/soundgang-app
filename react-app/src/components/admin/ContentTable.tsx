import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface ContentTableProps<T extends Record<string, unknown>> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export default function ContentTable<T extends Record<string, unknown>>({
    columns,
    data,
    isLoading,
    emptyMessage = 'No items found.',
}: ContentTableProps<T>) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-transparent">
                        {columns.map((col) => (
                            <TableHead key={col.key} className="text-gray-400 font-medium">
                                {col.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="border-gray-700">
                            <TableCell
                                colSpan={columns.length}
                                className="text-center text-gray-500 py-10"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, i) => (
                            <TableRow key={i} className="border-gray-700 hover:bg-gray-800/50">
                                {columns.map((col) => (
                                    <TableCell key={col.key} className="text-gray-300">
                                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
