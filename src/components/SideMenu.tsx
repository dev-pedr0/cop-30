import { NavLink } from 'react-router-dom'

const SideMenu = () => {
  return (
    <nav className="side-menu">
      <NavLink className="link" to="/countries">
        Países
      </NavLink>
      <NavLink className="link" to="/authorities">
        Autoridades
      </NavLink>
      <NavLink className="link" to="/agendas">
        Agendas
      </NavLink>
    </nav>
  )
}

export default SideMenu