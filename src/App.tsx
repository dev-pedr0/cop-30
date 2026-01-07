import { Routes, Route, Navigate } from 'react-router-dom'
import SideMenu from './components/SideMenu'
import Agendas from './pages/Agendas'
import Authorities from './pages/Authorities'
import Countries from './pages/Countries'

function App() {

  return (
    <div className="layout">
      <SideMenu />

      <main className="content">
        <header className="content-header">
          <h1 className="main-title">COP - 31</h1>
        </header>

        <section className="content-body">
          <Routes>
            <Route path="/" element={<Navigate to="/countries" />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/authorities" element={<Authorities />} />
            <Route path="/agendas" element={<Agendas />} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

export default App