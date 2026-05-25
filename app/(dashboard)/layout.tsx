import ProtectedRoutesProvider from '@/provider/ProtectedRoutesProvider'
import React from 'react'
import AdminSidebar from '../../components/mainComponents/sidebar'
import AdminFooter from '../../components/mainComponents/footer'

function AdminDashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex h-screen overflow-hidden bg-[#F8FAFC]'>
            <ProtectedRoutesProvider>
                {/* Sidebar: Fixed width and full height */}
                <AdminSidebar />

                {/* Main Content Wrapper: Vertical stack for Header, Main, and Footer */}
                <div className='flex flex-col flex-1 overflow-y-auto'>
                    <main className='flex-1 p-4 pt-20 md:p-8'>
                        {children}
                    </main>


                    <AdminFooter />
                </div>
            </ProtectedRoutesProvider>
        </div>
    )
}

export default AdminDashboardLayout