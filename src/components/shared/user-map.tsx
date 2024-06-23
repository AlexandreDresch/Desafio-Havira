import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { DivIcon, Icon, point } from "leaflet";
import "leaflet/dist/leaflet.css";
import { UserRoundSearchIcon } from "lucide-react";

import { AppDispatch, RootState } from "@/state/store";
import { getUsersData, filterList, updatePosition } from "@/state/user-slice";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import Spinner from "./spinner";

import UserCard from "./user-card";
import UserForm from "./user-form";
import UserDetails from "./user-details";

export default function UserMap() {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);
  const filteredUsers = useSelector(
    (state: RootState) => state.user.filteredUsers,
  );
  const userStatus = useSelector((state: RootState) => state.user.status);
  const position = useSelector((state: RootState) => state.user.position);

  function updateMapCenter(user: User) {
    if (openDrawer) {
      setOpenDrawer(false);
    }

    dispatch(
      updatePosition([
        parseFloat(user?.address?.geo.lat),
        parseFloat(user?.address?.geo.lng),
      ]),
    );
  }

  function handleQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function UpdateMapView() {
    const map = useMap();

    useEffect(() => {
      const [lat, lng] = position;

      if (lat !== null && lng !== null) {
        map.flyTo([lat, lng]);
      }
    }, [map]);

    return null;
  }

  function createCustomClusterIcon(cluster: { getChildCount: () => string }) {
    return new DivIcon({
      html: `<div> <span>${cluster.getChildCount()}</span> </div>`,
      className:
        "bg-red-500 text-white font-bold sizes-8 text-center flex justify-center items-center rounded-full",
      iconSize: point(30, 30, true),
    });
  }

  const PinPointIcon = new Icon({
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Pinpoint.svg/800px-Pinpoint.svg.png",
    iconSize: [30, 34],
    iconAnchor: [20, 0],
  });

  useEffect(() => {
    const filtered = users.filter((user) => {
      const normalizedQuery = query.toLowerCase();
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.address.city.toLowerCase().includes(normalizedQuery) ||
        user.phone.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)
      );
    });
    dispatch(filterList(filtered));
  }, [users, query, dispatch]);

  useEffect(() => {
    if (userStatus === "initial") {
      dispatch(getUsersData());
    }
  }, [userStatus, dispatch]);

  if (userStatus === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="relative flex h-[90%] gap-4">
      <aside className="sticky left-0 top-0 flex h-full w-fit flex-col justify-between space-y-3 border-r border-gray-200 max-md:hidden sm:p-4 sm:pt-0 md:w-[540px]">
        <div className="flex items-center gap-2">
          <Input
            onChange={(e) => handleQuery(e)}
            placeholder="Buscar usuário (Nome, Cidade, Email, Telefone)"
          />
        </div>
        <ScrollArea className="h-[90%] w-full rounded-sm border px-3 py-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                user={user}
                key={user.id}
                clickEvent={() => updateMapCenter(user)}
              />
            ))
          ) : (
            <p className="mt-5 text-center text-gray-500">
              Nenhum usuário encontrado.
            </p>
          )}
        </ScrollArea>

        <Dialog onOpenChange={setOpenModal} open={openModal}>
          <DialogTrigger className="rounded-md bg-primary py-2 font-semibold text-white dark:text-black">
            Adicionar Usuário
          </DialogTrigger>
          <DialogContent>
            <UserForm handleOpenModal={setOpenModal} type="create"/>
          </DialogContent>
        </Dialog>
      </aside>

      <Drawer direction="bottom" open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger className="absolute right-3 top-3 z-50 flex items-center justify-center gap-1 rounded-md border-2 border-solid border-[#b1b1b1] bg-white px-3 py-1 font-semibold text-black md:hidden">
          <UserRoundSearchIcon size={20} />
          <span className="">Usuários</span>
        </DrawerTrigger>
        <DrawerContent className="max-h-[500px] space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Input
              onChange={(e) => handleQuery(e)}
              placeholder="Buscar usuário (Nome, Cidade, Email, Telefone)"
            />
          </div>
          <ScrollArea className="h-[350px] w-full rounded-sm border px-3 py-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  user={user}
                  key={user.id}
                  clickEvent={() => updateMapCenter(user)}
                />
              ))
            ) : (
              <p className="mt-5 text-center text-gray-500">
                Nenhum usuário encontrado.
              </p>
            )}
          </ScrollArea>

          <Dialog onOpenChange={setOpenModal} open={openModal}>
            <DialogTrigger className="rounded-md bg-primary py-2 font-semibold text-white dark:text-black">
              Adicionar Usuário
            </DialogTrigger>
            <DialogContent>
              <UserForm handleOpenModal={setOpenModal} type="create"/>
            </DialogContent>
          </Dialog>
        </DrawerContent>
      </Drawer>

      <MapContainer
        center={
          position[0] !== null && position[1] !== null
            ? [position[0], position[1]]
            : [0, 0]
        }
        dragging={true}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={true}
        className="z-0 h-full w-full overflow-hidden rounded-md"
      >
        <UpdateMapView />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createCustomClusterIcon}
        >
          {filteredUsers?.map((user: User) => (
            <Marker
              key={user.id}
              position={{
                lat: +user?.address?.geo.lat,
                lng: +user?.address?.geo.lng,
              }}
              icon={PinPointIcon}
            >
              <Popup>
                <UserDetails user={user} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </section>
  );
}
