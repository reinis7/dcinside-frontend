import { DcHeader } from './layout/DcHeader.jsx'
import { HomeContent } from './layout/HomeContent.jsx'
import { HomeSidebar } from './layout/HomeSidebar.jsx'
import { DcFooter } from './layout/DcFooter.jsx'
import './App.css'

function App() {
  return (
    <div id="top" className="min-h-screen bg-[#eaeaea] text-left text-neutral-900">
      <DcHeader />

      <main id="container" className="mx-auto max-w-[1100px] px-3 py-4">
        <div className="main_content flex flex-col gap-4 gap-x-4 lg:flex-row lg:items-start">
          <HomeContent />
          <HomeSidebar />
        </div>
      </main>

      <DcFooter />
    </div>
  )
}

export default App
