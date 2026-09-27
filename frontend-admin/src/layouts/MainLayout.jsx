import { Outlet } from 'react-router-dom';

/**
 * MainLayout — Shell layout for all public pages.
 * Add a shared Navbar, Footer, or Sidebar here.
 */
function MainLayout() {
  return (
    <div className="app-wrapper">
      {/* TODO: <Navbar /> */}

      <main className="main-content">
        {/* <Outlet /> renders the matched child route */}
        <Outlet />
      </main>

      {/* TODO: <Footer /> */}
    </div>
  );
}

export default MainLayout;
