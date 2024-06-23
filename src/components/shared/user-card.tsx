import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import {
  BuildingIcon,
  MailIcon,
  MapPinnedIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react";
import { useState } from "react";
import UserForm from "./user-form";
import { useDispatch } from "react-redux";
import { useToast } from "../ui/use-toast";
import { deleteUser } from "@/state/user-slice";

export default function UserCard({ user, clickEvent }: UserCardProps) {
  const [value, setValue] = useState("Visitar");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleDeleteUser() {
    dispatch(deleteUser(user.id));
    toast({
      title: "Usuário excluído com sucesso!",
      description: `O usuário ${user.name} foi removido da sua lista.`,
    });
    setOpenDeleteDialog(false);
  }

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value={user.email}>
          <AccordionTrigger>{user.name}</AccordionTrigger>
          <AccordionContent className="flex justify-between gap-1">
            <div>
              <div className="flex items-center gap-1 text-sm">
                <MailIcon size={16} />
                <p className="max-w-32 truncate">{user.email}</p>
              </div>

              <div className="flex items-center gap-1">
                <BuildingIcon size={16} />
                <p>{user.address.city}</p>
              </div>
            </div>

            <div className="flex gap-2 z-50">
              <Select onValueChange={(value) => setValue(value)}>
                <SelectTrigger className="h-8 w-[90px] focus-visible:ring-transparent hidden sm:flex">
                  <SelectValue
                    placeholder={value}
                    defaultValue={value}
                    className="focus-visible:ring-transparent"
                  />
                </SelectTrigger>
                <SelectContent className="text-sm">
                  <SelectItem value="Visitar">Visitar</SelectItem>
                  <SelectItem value="Editar">Editar</SelectItem>
                  <SelectItem value="Excluir">Excluir</SelectItem>
                </SelectContent>
              </Select>

              {value === "Visitar" ? (
                <Button onClick={clickEvent} size="icon" className="size-8">
                  <MapPinnedIcon size={20} />
                </Button>
              ) : value === "Editar" ? (
                <Button
                  onClick={() => setOpenEditModal(true)}
                  size="icon"
                  className="size-8"
                >
                  <PencilIcon size={20} />
                </Button>
              ) : (
                <Button
                  onClick={() => setOpenDeleteDialog(true)}
                  size="icon"
                  className="size-8"
                >
                  <TrashIcon size={20} />
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Ao clicar em continuar você
              excluirá o usuário {user.name}.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>

            <Button onClick={handleDeleteUser}>Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setOpenEditModal} open={openEditModal}>
        <DialogContent>
          <UserForm handleOpenModal={setOpenEditModal} user={user} type="update"/>
        </DialogContent>
      </Dialog>
    </>
  );
}
