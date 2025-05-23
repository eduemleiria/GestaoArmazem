import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function DeleteUserButton({ userId }: { userId: number }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('remover-user.destroy', userId), {
            onSuccess: () => {
                setOpen(false);
            },
            onError: () => alert('Erro ao remover o utilizador'),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className="flex items-center text-sm font-bold text-red-600 hover:text-red-400">
                    <TrashIcon className="mr-3 ml-1 p-1" />
                    Remover
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Quer mesmo apagar este user?</AlertDialogTitle>
                    <AlertDialogDescription>Esta ação não pode ser desfeita. Isto removerá permanentemente o user do sistema.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-800">
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
