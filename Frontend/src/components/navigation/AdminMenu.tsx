import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

export const adminMenu = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Desafíos",
    path: "/admin/desafios",
    icon: EmojiEventsOutlinedIcon,
  },
  {
    label: "Recompensas",
    path: "/admin/recompensas",
    icon: CardGiftcardOutlinedIcon,
  },
  {
    label: "Premios",
    path: "/admin/premios",
    icon: Inventory2OutlinedIcon,
  },
  {
  label: "Seguridad",
  path: "/admin/seguridad",
  icon: <SecurityOutlinedIcon />,
}
];