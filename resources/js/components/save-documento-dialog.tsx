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
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function SaveDocumentoButton({ documentoId, onSave, values }: { documentoId: any; onSave?: () => void; values: any }) {
    const [open, setOpen] = useState(false);

    const handleSave = () => {
        router.patch(route('editar-documento.update', documentoId), values, {
            onSuccess: () => {
                onSave?.();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="w-46 flex flex-start hover:bg-green-500">Guardar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Quer mesmo guardar este documento?</AlertDialogTitle>
                    <AlertDialogDescription className="text-black">
                        <b>Esta ação não pode ser desfeita.</b><br />
                        Isto irá deixar o documento <b>não editável e <u>insirá/removerá</u></b> as respetivas paletes no/do sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave} className="bg-green-600 hover:bg-green-800">
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
