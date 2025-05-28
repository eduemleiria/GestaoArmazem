import { useState } from "react";
import { router } from "@inertiajs/react";
import { TrashIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteFaturaButton({ faturaId, onDelete }: { faturaId: number; onDelete?: ()=> void; }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route("remover-fatura.destroy", faturaId), {
            onSuccess: () => {
                setOpen(false);
                onDelete?.();
            },
            onError: () => alert("Erro ao remover a fatura"),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <button className="flex items-center text-sm font-bold text-red-600 hover:text-red-400">
                    <TrashIcon className="ml-1 p-1 mr-3" />
                    Remover
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Quer mesmo apagar esta fatura?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isto removerá permanentemente a fatura do sistema.
                    </AlertDialogDescription>
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
