import { HomeBelowColumns } from './components/home/HomeBelowColumns'
import { HomeMainColumn } from './components/home/HomeMainColumn'
import { HomeSidebar } from './components/home/sidebar/HomeSidebar'
import { Layout } from './components/layout/Layout'

function App() {
  return (
    <Layout
      main={<HomeMainColumn />}
      sidebar={<HomeSidebar />}
      belowColumns={<HomeBelowColumns />}
    />
  )
}

export default App
