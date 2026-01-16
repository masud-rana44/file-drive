import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../../components/ui/button";

export function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="flex items-center container mx-auto justify-between">
        <h1 className="text-xl font-bold">File Drive</h1>

        <div className="flex items-center gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
