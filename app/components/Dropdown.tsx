import { useAuth } from '@/lib/auth/AuthContext'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import { User } from '@prisma/client'
import { redirect } from 'next/navigation'

function Avatar() {
  return <UserCircleIcon className="w-8 h-8 fill-white" />
}

export default function ProfileDropdown({ user }: { user: User | undefined }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    redirect('/login')
  }

  return (
    <Menu>
      <MenuButton as="button" className="">
        <Avatar />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 p-4 flex flex-col gap-4 origin-top-right rounded-xl border border-white/5 bg-white text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <p className="text-sm font-medium">
            {user?.firstname} {user?.lastname}
          </p>
        </MenuItem>
        <MenuItem>
          <button
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-white/5" />
      </MenuItems>
    </Menu>
  )
}
