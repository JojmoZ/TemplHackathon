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
} from '@/components/ui/navigation-menu';
import { ListItem } from '@/components/ui/list-item';
import Link from 'next/link';
import { useGetAuthenticated } from '@/hooks/user/use-get-authenticated';
import useServiceContext from '@/hooks/use-service-context';
import { useNavigate } from 'react-router';
import { RouteEnum } from '@/lib/enum/router-enum';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { deserializeImage } from '@/lib/utils/Image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Login',
    href: RouteEnum.LOGIN,
    description: 'Login to access your account.',
  },
  {
    title: 'Home',
    href: '/',
    description: 'Main landing page.',
  },
  {
    title: 'Create Post',
    href: RouteEnum.CREATE_POST,
    description: 'Create a new loan post.',
  },
  {
    title: 'Edit Profile',
    href: RouteEnum.EDIT_PROFILE,
    description: 'Modify your profile details.',
  },
  {
    title: 'Chat',
    href: '/chat',
    description: 'Access your messages.',
  },
  {
    title: 'Post Verification',
    href: RouteEnum.POST_VERIFICATION,
    description: 'Verify posts before publishing.',
  },
  {
    title: 'Loan Detail',
    href: RouteEnum.POST,
    description: 'View details of a loan post.',
  },
  {
    title: 'Transaction History',
    href: RouteEnum.TRANSACTION_HISTORY,
    description: 'Check your past transactions.',
  },
  {
    title: 'User Page',
    href: '/temp',
    description: 'Temporary user page.',
  },
  {
    title: 'Temp Page 2',
    href: '/temp2',
    description: 'Another temporary page.',
  },
  {
    title: 'For Borrowers',
    href: RouteEnum.BORROWER,
    description: 'Borrow money easily.',
  },
  {
    title: 'Profile',
    href: RouteEnum.PROFILE,
    description: 'Manage your profile settings.',
  },
  {
    title: 'Browse Loans',
    href: RouteEnum.BROWSE,
    description: 'Explore available loan posts.',
  },
];

const for_borrowers: { title: string; href: string; description: string }[] = [
  {
    title: 'Borrow',
    href: RouteEnum.BORROWER,
    description: 'Borrow money easily.',
  },
];

const for_all: { title: string; href: string; description: string }[] = [
  {
    title: 'Profile',
    href: RouteEnum.PROFILE,
    description: 'Manage your profile settings.',
  },
  {
    title: 'Transaction History',
    href: RouteEnum.TRANSACTION_HISTORY,
    description: 'Check your past transactions.',
  },
];

const for_lenders: { title: string; href: string; description: string }[] = [
  {
    title: 'Browse Loans',
    href: RouteEnum.BROWSE,
    description: 'Explore available loan posts.',
  },
];
const for_admin: { title: string; href: string; description: string }[] = [
  {
    title: 'Verify Post',
    href: RouteEnum.POST_VERIFICATION,
    description: 'Verify posts before publishing.',
  },
];

function Header() {
  const navigate = useNavigate();
  const { me, isAuthenticated, fetch } = useGetAuthenticated();
  const { userService } = useServiceContext();
  const logout = () => {
    toast.promise(userService.logout(), {
      loading: 'Logging out...',
      success: () => {
        fetch();
        return 'Logged out successfully.';
      },
      error: 'Failed to log out.',
    });
  };

  const handleIIlogin = async () => {
    try {
      const loggedInUser = await userService.login();

      if (loggedInUser) {
        console.log('Logged in user:', loggedInUser);
        fetch();

        if (!loggedInUser.username || loggedInUser.username.trim() === '') {
          console.log('Redirecting to edit profile...');

          navigate('/edit-profile'); // No username → go to edit profile
        } else {
          console.log('Redirecting to temp...');
          navigate('/home'); // Username exists → go to temp
        }
      } else {
        console.log('Failed to retrieve user information.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      console.log('Something went wrong. Try again.');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Logo className="h-12" />

        <NavigationMenu className="ml-auto hidden gap-6 md:flex">
          <NavigationMenuList>
            {[
              {
                label: 'For Borrowers',
                links: for_borrowers,
              },
              {
                label: 'For Lenders',
                links: for_lenders,
              },
              {
                label: 'Admin',
                links: for_admin,
              },
              {
                label: 'For All',
                links: for_all,
              },
              {
                label: 'All LINKS Available',
                links: components,
              },
            ].map((menu) => (
              <NavigationMenu>
                <NavigationMenuItem key={menu.label}>
                  <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {menu.links.map((route) => (
                      <a key={route.href} href={route.href}>
                        <div>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            style={{ width: 200 }}
                          >
                            {route.title}
                          </NavigationMenuLink>
                        </div>
                      </a>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenu>
            ))}
            <NavigationMenuItem>
              {!isAuthenticated ? (
                <Button variant="gradient" onClick={handleIIlogin}>
                  Sign In
                </Button>
              ) : (
                // <Button variant="gradient" onClick={logout}>
                //   Log out
                // </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-14 w-14 md:h-14 md:w-14 border-4 border-background shadow-xl cursor-pointer">
                      <AvatarFallback className="bg-primary text-md">
                        {me?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                      <AvatarImage
                        src={deserializeImage(me?.profilePicture ?? [])}
                        alt={me?.username || 'User'}
                      />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="container text-left">
                    <DropdownMenuItem
                      onClick={() => navigate(RouteEnum.PROFILE)}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(RouteEnum.TRANSACTION_HISTORY)}
                    >
                      Transaction History
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

export default Header;
