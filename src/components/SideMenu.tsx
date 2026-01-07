import { NavLink } from 'react-router-dom'
import CountriesList from './CountriesList'

const SideMenu = () => {
  return (
    <nav className="side-menu">
      <h2 className="side-title">Menu</h2>
      <NavLink className="link" to="/countries">
        Países
      </NavLink>
      <NavLink className="link" to="/authorities">
        Autoridades
      </NavLink>
      <NavLink className="link" to="/agendas">
        Agendas
      </NavLink>
      <CountriesList/>
    </nav>
  )
}

export default SideMenu