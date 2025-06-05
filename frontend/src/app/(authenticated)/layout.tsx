'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useSession } from 'next-auth/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/landingpage',
      redirect: true,
    })
  }
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    return paths.map((path, index) => {
      // Capitalize and format path
      const title = path.charAt(0).toUpperCase() + path.slice(1)
      return (
        <Fragment key={path}>
          {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbPage className="font-semibold">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </Fragment>
      )
    })
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbList className="font-medium">
                  {getBreadcrumbs()}
                </BreadcrumbList>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex h-16 items-center px-4 space-x-4">
            <ThemeToggle />
            <Button variant="ghost">
              {session?.user?.role || 'Loading...'}
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
