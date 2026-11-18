import { createFileRoute, Outlet } from "@tanstack/react-router";

// Uso pessoal, sem login: os registros ficam salvos no próprio aparelho,
// por isso as telas são montadas só no navegador.
export const Route = createFileRoute("/_gd")({
  ssr: false,
  component: () => <Outlet />,
});
