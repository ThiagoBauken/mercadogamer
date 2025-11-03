export const navItems = [
  {
    label: "",
    item: [
      // {
      //   icon: 'home',
      //   label: 'Home',
      //   route: 'home',
      // },
      // {
      //   label: 'Vender',
      //   icon: 'vender',
      //   route: 'product-type',
      // },
      {
        label: "Compras",
        icon: "shopping-cart",
        route: "my-account/shopping",
      },
      {
        label: "Regalos",
        icon: "gift",
        route: "my-account/gifts",
      },
    ],
  },
  {
    label: "Mis ventas",
    login: true,
    item: [
      {
        label: "Ventas",
        icon: "invoice",
        route: "my-account/sales",
      },
      {
        label: "Productos",
        icon: "package-box",
        route: "my-account/sales-products",
      },
      {
        label: "Consultas",
        icon: "consultas",
        route: "my-account/sales-QAs",
      },
      {
        label: "Retirar",
        icon: "money-withdrawal",
        route: "my-account/sales-retire",
      },
    ],
  },
  {
    label: "Otros",
    login: true,
    item: [
      {
        label: "Ajustes",
        icon: "ajustes",
        route: "my-account/settings",
      },
      {
        label: "Preguntas",
        icon: "preguntas",
        route: "my-account/QAs",
      },
      {
        label: "Tickets",
        icon: "tickets",
        route: "my-account/tickets",
      },
      {
        label: "Seguridad",
        icon: "security",
        route: "my-account/security",
      },
    ],
  },
];
