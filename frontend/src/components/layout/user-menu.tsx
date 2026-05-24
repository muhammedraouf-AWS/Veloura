"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/actions/auth.actions";

export function UserMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return (
      <div className="hidden md:flex items-center gap-2 ml-2">
        <Button variant="ghost" size="sm" render={<Link href="/login" />}>
          Sign in
        </Button>
        <Button size="sm" render={<Link href="/register" />}>
          Register
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="My account"
            className="hidden md:inline-flex ml-2"
          />
        }
      >
        <User className="h-5 w-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem render={<Link href="/account/profile" />}>
          My account
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/orders" />}>
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/wishlist" />}>
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem
            render={<button type="submit" className="w-full cursor-pointer" />}
          >
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
