import { Link, Outlet } from "react-router-dom";

export default function Layout() {

  const divStyle = {
    position:"absolute",
    zIndex:"2000",
  };

    return (
        <div>
        <nav style={divStyle}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/particles-canvas">2d particles canvas</Link>
          </li>
          <li>
            <Link to="/react-components">react components</Link>
          </li>
          <li>
            <Link to="/cube-flow">3d cube flow</Link>
          </li>
          <li>
            <Link to="/cube-grid">3d cube grid</Link>
          </li>
          <li>
            <Link to="/react-particles">3d particles</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
      </div>
    )
}