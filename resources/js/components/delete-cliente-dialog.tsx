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
import { Cliente } from "@/types";

export default function DeleteUserButton({ clienteId }: { clienteId: number }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route("remover-cliente.destroy", clienteId), {
            onSuccess: () => {
                setOpen(false);
            },
            onError: () => alert("Erro ao remover o cliente"),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className="flex items-center text-sm font-bold text-red-600 hover:text-red-400">
                    <TrashIcon className="ml-1 p-1 mr-3" />
                    Remover
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Quer mesmo apagar este cliente?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isto removerá permanentemente o cliente do sistema.
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
