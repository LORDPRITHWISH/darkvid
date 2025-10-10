import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Layers, LifeBuoy, Terminal } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router";

export function AvatarDropdown() {
      const {profilePhoto, name, email} = useUserStore((s) => s);

      const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border">
          <AvatarImage src={profilePhoto || "/profilepic.png"} alt="Olivia Rhye" />
          <AvatarFallback>OR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60 p-0 overflow-hidden rounded-xl shadow-lg">
        {/* Header with avatar and info */}
        <div className="flex items-center gap-3 p-4 pb-3 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePhoto || "/profilepic.png"} alt="Olivia Rhye" />
            <AvatarFallback>OR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1">
          <DropdownMenuItem onClick={() => navigate("/chanel")}>
            <User className="mr-2 h-4 w-4" />
            <span>View profile</span>
            {/* <kbd className="ml-auto text-xs text-muted-foreground">⌘K ⌘P</kbd> */}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigate("/studio")}>
            <Layers className="mr-2 h-4 w-4" />
            <span>Studio</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            {/* <kbd className="ml-auto text-xs text-muted-foreground">⌘S</kbd> */}
          </DropdownMenuItem>

          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Terminal className="mr-2 h-4 w-4" />
            <span>API</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            {/* <kbd className="ml-auto text-xs text-muted-foreground">⇧⌘Q</kbd> */}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
