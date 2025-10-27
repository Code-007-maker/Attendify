import React from 'react'
import { SidebarDemo } from '../components/sidebar'
import { TeachSidebar } from '../components/teachSidebar'

function TeacherDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <TeachSidebar/>
    </div>
  )
}

export default TeacherDashboard
