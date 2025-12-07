import { NavLink } from 'react-router';

export function AppNav() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/about" end>
        About
      </NavLink>
      <NavLink to="/sign-in" end>
        Sign In
      </NavLink>
      <NavLink to="/sign-up" end>
        Sign Up
      </NavLink>
    </nav>
  );
}
