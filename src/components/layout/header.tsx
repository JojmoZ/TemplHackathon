import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ListItem } from '@/components/ui/list-item';
import Link from 'next/link';
import { useGetAuthenticated } from '@/hooks/user/use-get-authenticated';
import useServiceContext from '@/hooks/use-service-context';
import { useNavigate } from 'react-router';
import { RouteEnum } from '@/lib/enum/router-enum';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated } = useGetAuthenticated();
  const { userService } = useServiceContext();
  const logout = () => {
    userService.logout();
  }

  const redirect = () => {
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Logo className="h-12" />
        <NavigationMenu className="ml-auto hidden gap-6 md:flex">
          <NavigationMenuList>
            {/* TODO: reroute */}
            <NavigationMenuItem>
              <Link href={RouteEnum.BORROWER} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  For Borrowers
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={RouteEnum.BROWSE} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  For Lenders
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-4 md:ml-4">
          {
            !isAuthenticated ?
              <Button variant="gradient" onClick={redirect}>Sign In</Button>
              :
              <Button variant="gradient" onClick={logout}>Log out</Button>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;