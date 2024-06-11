export default function UserDetails({ user }: { user: User }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="text-lg font-semibold">Sobre o Usuário:</h3>
      <div className="mb-2 h-px w-full bg-gray-200" />
      <div>
        <span className="font-bold">Nome: </span>
        <span>{user.name}</span>
      </div>
      <div>
        <span className="font-bold">Email: </span>
        <span>{user.email}</span>
      </div>
      <div>
        <span className="font-bold">Cidade: </span>
        <span>{user.address.city}</span>
      </div>
    </div>
  );
}
