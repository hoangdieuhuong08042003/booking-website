import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex justify-center items-center w-fit h-10 mx-auto p-1 rounded-xl gap-1">
      {onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="inline-block w-4 h-4 dark:text-white" />
        </Button>
      )}
      <Separator orientation="vertical" className="h-5" />
      {onDelete && (
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="inline-block w-4 h-4" color="#EF3826" />
        </Button>
      )}
    </div>
  );
}
