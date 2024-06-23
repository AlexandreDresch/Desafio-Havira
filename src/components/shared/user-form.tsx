import { userSchema } from "@/lib/schemas/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "@/state/user-slice";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./custom-input";
import { getGeolocation } from "@/services/geolocation-api";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import Spinner from "./spinner";

export default function UserForm({
  user,
  type,
  handleOpenModal,
}: {
  user?: User;
  type: "create" | "update";
  handleOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const dispatch = useDispatch();

  const formSchema = userSchema(type);

  const defaultValues = {
    name: user?.name || "",
    city: user?.address.city || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address.street || "",
    number: user?.address.suite || "",
    zipCode: user?.address.zipcode || "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const fullAddress = `${values.street}, ${values.number}, ${values.city}, ${values.zipCode}`;
      const geoLocation = await getGeolocation(fullAddress);

      if (!geoLocation) {
        toast({
          variant: "destructive",
          title: "Algo deu errado!",
          description:
            "Não foi possível obter a geolocalização do endereço passado.",
        });
        return;
      }

      const userToSubmit = createUser(values, geoLocation);

      if (user) {
        dispatch(updateUser(userToSubmit));
        toast({
          title: "Usuário atualizado com sucesso!",
          description: "As informações do usuário foram atualizadas.",
        });
      } else {
        dispatch(addUser(userToSubmit));
        toast({
          title: "Usuário adicionado com sucesso!",
          description: "Você pode encontrá-lo na sua lista de usuários.",
        });
      }

      handleOpenModal(false);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Algo deu errado!",
        description: "Não foi possível adicionar o usuário à lista.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function createUser(
    values: z.infer<typeof formSchema>,
    geoLocation: { lat: string; lng: string },
  ) {
    return {
      id: user?.id || Date.now(),
      name: values.name,
      username: user?.username || "",
      company: user?.company || { name: "", catchPhrase: "", bs: "" },
      address: {
        street: values.street,
        suite: values.number,
        city: values.city,
        zipcode: values.zipCode,
        geo: geoLocation,
      },
      phone: values.phone,
      website: user?.website || "",
      email: values.email,
    };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Nome do usuário"
          type="text"
        />

        <CustomInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="email@exemplo.com"
          type="email"
        />

        <div className="flex justify-between gap-2">
          <CustomInput
            control={form.control}
            name="phone"
            label="Telefone"
            placeholder="999999999"
            type="text"
          />

          <CustomInput
            control={form.control}
            name="city"
            label="Cidade"
            placeholder="São Paulo"
            type="text"
          />
        </div>

        <div className="flex justify-between">
          <CustomInput
            control={form.control}
            name="street"
            label="Rua"
            placeholder="Rua XX"
            type="text"
          />

          <CustomInput
            control={form.control}
            name="number"
            label="Número"
            placeholder="000"
            type="text"
          />
        </div>
        <CustomInput
          control={form.control}
          name="zipCode"
          label="CEP"
          placeholder="12345-678"
          type="text"
        />
        <Button type="submit" disabled={isLoading} className="w-32">
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <span>{user ? "Atualizar usuário" : "Criar usuário"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
