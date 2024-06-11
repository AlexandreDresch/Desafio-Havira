import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { BuildingIcon, MailIcon, MapPinnedIcon } from "lucide-react";

export default function UserCard({ user, clickEvent }: UserCardProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={user.email}>
        <AccordionTrigger>{user.name}</AccordionTrigger>
        <AccordionContent className="flex justify-between">
          <div>
            <div className="flex items-center gap-1 text-sm">
              <MailIcon size={16} />
              <p>{user.email}</p>
            </div>

            <div className="flex items-center gap-1">
              <BuildingIcon size={16} />
              <p>{user.address.city}</p>
            </div>
          </div>
          <Button onClick={clickEvent} size="icon" className="size-8">
            <MapPinnedIcon size={20} />
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
