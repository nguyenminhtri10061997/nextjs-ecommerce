import ContactPageIcon from "@mui/icons-material/ContactPage";
import { EPermissionAction, EPermissionResource } from "@prisma/client";

export type TDashBoardMenuItem = {
  label: string;
  perAction?: EPermissionAction;
  perResource?: EPermissionResource;
  icon?: React.ReactElement;
  to?: string;
  children?: TDashBoardMenuItem[];
};

export const DASHBOARD_MENU_ITEMS: TDashBoardMenuItem[] = [
  {
    label: "User Management",
    icon: <ContactPageIcon />,
    children: [
      {
        label: "User",
        to: "/dashboard/user",
        icon: <ContactPageIcon />,
        perResource: EPermissionResource.USER,
        perAction: EPermissionAction.READ,
      },
      {
        label: "Role",
        to: "/dashboard/role",
        icon: <ContactPageIcon />,
        perAction: EPermissionAction.READ,
        perResource: EPermissionResource.ROLE,
      },
      {
        label: "Permission",
        to: "/dashboard/permission",
        icon: <ContactPageIcon />,
        perAction: EPermissionAction.READ,
        perResource: EPermissionResource.PERMISSION,
      },
    ],
  },
  {
    label: "Product",
    to: "/dashboard/product",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.PRODUCT,
    perAction: EPermissionAction.READ,
  },
  {
    label: "Attribute",
    to: "/dashboard/attribute",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.ATTRIBUTE,
    perAction: EPermissionAction.READ,
  },
  {
    label: "Option",
    to: "/dashboard/option",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.OPTION,
    perAction: EPermissionAction.READ,
  },
  {
    label: "Brand",
    to: "/dashboard/brand",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.BRAND,
    perAction: EPermissionAction.READ,
  },
  {
    label: "Language",
    to: "/dashboard/language",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.LANGUAGE,
    perAction: EPermissionAction.READ,
  },
  {
    label: "Product Category",
    to: "/dashboard/product-category",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.PRODUCT_CATEGORY,
    perAction: EPermissionAction.READ,
  },
  {
    label: "Product Tag",
    to: "/dashboard/product-tag",
    icon: <ContactPageIcon />,
    perResource: EPermissionResource.PRODUCT_CATEGORY,
    perAction: EPermissionAction.READ,
  },
];

export const ADMIN_DRAWER_WIDTH = 250;
