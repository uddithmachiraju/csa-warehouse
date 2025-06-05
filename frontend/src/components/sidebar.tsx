import Link from 'next/link'
import { LayoutDashboard, Users, Settings, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sidebarItems = [
  {
    title: 'CSA Datastore',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: 'About Us',
    icon: Users,
    href: '/about',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
  {
    title: 'Support',
    icon: HelpCircle,
    href: '/support',
  },
]

export function Sidebar() {
  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Pages</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.href === '/' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
