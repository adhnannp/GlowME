import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { GCoin } from '@/pages/admin/GCoin/GCoinDashboard';

interface GCoinTableProps {
  gcoins: GCoin[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  onEdit: (gcoin: GCoin) => void;
  onListUnlist: (gcoin: GCoin) => void;
}

export default function GCoinTable({
  gcoins,
  currentPage,
  itemsPerPage,
  loading,
  onEdit,
  onListUnlist,
}: GCoinTableProps) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGCoins = gcoins.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Title</TableHead>
          <TableHead>Coins</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Loading GCoins...
            </TableCell>
          </TableRow>
        ) : currentGCoins.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              No GCoins found
            </TableCell>
          </TableRow>
        ) : (
          currentGCoins.map((gcoin) => (
            <TableRow key={gcoin._id}>
              <TableCell>{gcoin.title}</TableCell>
              <TableCell>{gcoin.coins}</TableCell>
              <TableCell>₹{gcoin.price}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  onClick={() => onListUnlist(gcoin)}
                  variant={gcoin.isListed ? 'destructive' : 'success'}
                  size="sm"
                >
                  {gcoin.isListed ? 'Unlist' : 'List'}
                </Button>
                <Button
                  onClick={() => onEdit(gcoin)}
                  className="bg-[#FF9838] hover:bg-[#e67f26]"
                  size="sm"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}