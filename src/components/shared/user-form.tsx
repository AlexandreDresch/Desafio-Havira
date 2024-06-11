import { userSchema } from "@/lib/schemas/user-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { addUser } from "@/state/user-slice";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./custom-input";
import { getGeoLocation } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import Spinner from "./spinner";

export default function UserForm({
  handleOpenModal,
}: {
  handleOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      city: "",
      email: "",
      phone: "",
      street: "",
      number: "",
      zipCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setIsLoading(true);
    const fullAddress = `${values.street}, ${values.number}, ${values.city}, ${values.zipCode}`;

    const geoLocation = await getGeoLocation(fullAddress);

    if (!geoLocation) {
      toast({
        variant: "destructive",
        title: "Algo deu errado!",
        description:
          "Não foi possível obter a geolocalização do endereço passado.",
      });
      return;
    }

    dispatch(
      addUser({
        id: Date.now(),
        name: values.name,
        username: "",
        company: { name: "", catchPhrase: "", bs: "" },
        address: {
          street: values.street,
          suite: "",
          city: values.city,
          zipcode: values.zipCode,
          geo: geoLocation,
        },
        phone: values.phone,
        website: "",
        email: values.email,
      }),
    );

    toast({
      title: "Usuário adicionado com sucesso!",
      description: "Você pode encontrá-lo na sua lista de usuários.",
    });

    setIsLoading(false);
    handleOpenModal(false);
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
          {isLoading ? <Spinner className="size-4"/> : <span>Criar usuário</span>}
        </Button>
      </form>
    </Form>
  );
}
