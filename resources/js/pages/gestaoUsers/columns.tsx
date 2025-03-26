import { ColumnDef } from "@tanstack/react-table"

export type Cliente = {
  id: string
  name: string
  email: string
  created_at: string
}

export const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Conta criada em",
  },
]
