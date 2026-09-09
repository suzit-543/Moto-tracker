import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className='navbar'>
      <NavLink to ='/'className="navbar__brand">MotoTracker</NavLink>
      <div className='navbar__links'>
      <NavLink to="/" end  className="navbar_link">Dashboard</NavLink>
      <NavLink to="/add" className="navbar_link">Add Entry</NavLink>
      <NavLink to="/history" className="navbar_link">History</NavLink>
      <NavLink to="/stats" className="navbar_link">Stats</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;