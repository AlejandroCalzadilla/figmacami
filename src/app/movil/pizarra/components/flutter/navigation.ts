// Definición de componentes de Flutter Navigation para GrapesJS - Inspirados en Material 3
export function addFlutterNavigationComponents(editor: any) {
  const navigationCategory = 'Flutter - Navigation';

  // AppBar
  editor.BlockManager.add('flutter-nav-appbar', {
    label: 'AppBar',
    category: navigationCategory,
    content: `
      <header data-gjs-type="flutter-nav-appbar" style="height: 64px; background: #1976d2; color: #fff; display: flex; align-items: center; padding: 0 24px; font-size: 1.25rem; font-weight: 600; letter-spacing: 0.02em; box-shadow: 0 2px 4px rgba(25,118,210,0.08);">
        <span style="margin-right: 16px; font-size: 1.5rem; cursor: pointer;">☰</span>
        AppBar
      </header>
    `,
    attributes: { class: 'fa fa-header' },
  });

  // BottomNavigationBar
  editor.BlockManager.add('flutter-nav-bottom-navigation-bar', {
    label: 'BottomNavigationBar',
    category: navigationCategory,
    content: `
      <nav  style="height: 64px; background: #fff; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-evenly; align-items: center; gap: 16px;">
        <button style="background: none; border: none; color: #1976d2; font-size: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;">
          <span style="font-size: 1.7rem;">●</span>
          <span style="font-size: 0.85rem;">Home</span>
        </button>
        <button style="background: none; border: none; color: #757575; font-size: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;">
          <span style="font-size: 1.7rem;">●</span>
          <span style="font-size: 0.85rem;">Search</span>
        </button>
        <button style="background: none; border: none; color: #757575; font-size: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;">
          <span style="font-size: 1.7rem;">●</span>
          <span style="font-size: 0.85rem;">Profile</span>
        </button>
      </nav>
    `,
    attributes: { class: 'fa fa-bars' },
  });

  // NavigationRail
  editor.BlockManager.add('flutter-nav-rail', {
    label: 'NavigationRail',
    category: navigationCategory,
    content: `
      <nav  style="width: 72px; min-height: 100vh; background: #f5f5f5; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; align-items: center; padding: 16px 0; gap: 16px;">
        <button style="background: none; border: none; color: #1976d2; font-size: 1.5rem; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer;">🏠</button>
        <button style="background: none; border: none; color: #757575; font-size: 1.5rem; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer;">🔍</button>
        <button style="background: none; border: none; color: #757575; font-size: 1.5rem; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer;">👤</button>
      </nav>
    `,
    attributes: { class: 'fa fa-ellipsis-v' },
  });

  // Drawer
  editor.BlockManager.add('flutter-nav-drawer', {
    label: 'Drawer',
    category: navigationCategory,
    content: `
      <aside  style="width: 260px; min-height: 100vh; background: #fff; box-shadow: 2px 0 8px rgba(0,0,0,0.08); border-radius: 0 18px 18px 0; padding: 24px 0; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 1.2rem; font-weight: 600; color: #1976d2; padding: 0 24px 16px 24px;">Menú</div>
        <button style="background: none; border: none; color: #222; font-size: 1.1rem; text-align: left; padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Inicio</button>
        <button style="background: none; border: none; color: #222; font-size: 1.1rem; text-align: left; padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Perfil</button>
        <button style="background: none; border: none; color: #222; font-size: 1.1rem; text-align: left; padding: 12px 24px; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Ajustes</button>
      </aside>
    `,
    attributes: { class: 'fa fa-bars' },
  });

  // TabBar
  editor.BlockManager.add('flutter-nav-tabbar', {
    label: 'TabBar',
    category: navigationCategory,
    content: `
      <nav  style="display: flex; gap: 8px; background: #f5f5f5; border-radius: 12px; padding: 8px 12px; margin: 12px 0;">
        <button style="background: #1976d2; color: #fff; border: none; border-radius: 8px; padding: 8px 20px; font-size: 1rem; font-weight: 600; cursor: pointer;">Tab 1</button>
        <button style="background: none; color: #1976d2; border: none; border-radius: 8px; padding: 8px 20px; font-size: 1rem; font-weight: 600; cursor: pointer;">Tab 2</button>
        <button style="background: none; color: #1976d2; border: none; border-radius: 8px; padding: 8px 20px; font-size: 1rem; font-weight: 600; cursor: pointer;">Tab 3</button>
      </nav>
    `,
    attributes: { class: 'fa fa-folder' },
  });
}
