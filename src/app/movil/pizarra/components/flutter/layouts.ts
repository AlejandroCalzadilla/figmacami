// Definición de componentes de Flutter Layout para GrapeJS - Optimizados para móvil
export function addFlutterLayoutComponents(editor: any) {
  // Categoría para los componentes de layout
  const layoutCategory = 'Flutter - Layout';
  
  // Dimensiones para móvil
  const mobileWidth = '412px';

  // Scaffold - Estructura básica de una pantalla Flutter para web
  editor.BlockManager.add('flutter-scaffold', {
    label: 'Scaffold',
    category: layoutCategory,
    content: `
      <section  style="display: flex; flex-direction: column; min-height: 100vh; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-radius: 18px; overflow: hidden;">
        <header  style="height: 64px; background: #1976d2; color: #fff; display: flex; align-items: center; padding: 0 24px; font-size: 1.25rem; font-weight: 600; letter-spacing: 0.02em; box-shadow: 0 2px 4px rgba(25,118,210,0.08);">
          App Title
        </header>
        <main  style="flex: 1; padding: 32px 20px; background: #f7f7fa;">
          <div style="text-align: center; color: #888; font-size: 1.1rem;">Agrega contenido aquí</div>
        </main>
        <nav id="flutter-bottom-navigation-bar" style="height: 64px; background: #fff; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-evenly; align-items: center; gap: 16px;">
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
      </section>
    `,
    attributes: { class: 'fa fa-mobile' },
  });

  // Container - Contenedor Material 3
  editor.BlockManager.add('flutter-container', {
    label: 'Container',
    category: layoutCategory,
    content: `
      <div  style="background: #e3f2fd; border-radius: 12px; padding: 20px; margin: 16px 0; box-shadow: 0 1px 4px rgba(33,150,243,0.08); display: flex; align-items: center; justify-content: center; min-height: 60px;">
        <span style="color: #1976d2; font-weight: 500;">Container Content</span>
      </div>
    `,
    attributes: { class: 'fa fa-square-o' },
  });

  // Row - Disposición horizontal Material 3
  editor.BlockManager.add('flutter-row', {
    label: 'Row',
    category: layoutCategory,
    content: `
      <div  style="display: flex; flex-direction: row; gap: 16px; width: 100%; padding: 12px; margin: 16px 0; background: #f5f5f5; border-radius: 12px; align-items: center; overflow-x: auto;">
        <div style="min-width: 48px; height: 48px; background: #1976d2; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">1</div>
        <div style="min-width: 48px; height: 48px; background: #43a047; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">2</div>
        <div style="min-width: 48px; height: 48px; background: #ffb300; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">3</div>
      </div>
    `,
    attributes: { class: 'fa fa-ellipsis-h' },
  });

  // Column - Disposición vertical Material 3
  editor.BlockManager.add('flutter-column', {
    label: 'Column',
    category: layoutCategory,
    content: `
      <div  style="display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 12px; margin: 16px 0; background: #f5f5f5; border-radius: 12px;">
        <div style="width: 100%; height: 40px; background: #ff7043; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">1</div>
        <div style="width: 100%; height: 40px; background: #8e24aa; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">2</div>
        <div style="width: 100%; height: 40px; background: #3949ab; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">3</div>
      </div>
    `,
    attributes: { class: 'fa fa-ellipsis-v' },
  });

  // Stack - Superposición Material 3
  editor.BlockManager.add('flutter-stack', {
    label: 'Stack',
    category: layoutCategory,
    content: `
      <div  style="position: relative; width: 100%; height: 160px; background: #eeeeee; border-radius: 12px; margin: 16px 0;">
        <div style="position: absolute; top: 24px; left: 24px; width: 80px; height: 80px; background: #1976d2; border-radius: 12px; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600;">Back</div>
        <div style="position: absolute; top: 56px; left: 56px; width: 100px; height: 80px; background: #ffb300; border-radius: 12px; opacity: 0.92; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; z-index: 1;">Front</div>
      </div>
    `,
    attributes: { class: 'fa fa-clone' },
  });

  // Expanded - Material 3
  editor.BlockManager.add('flutter-expanded', {
    label: 'Expanded',
    category: layoutCategory,
    content: `
      <div  style="flex: 1; background: #ede7f6; min-height: 40px; border-radius: 12px; padding: 12px; margin: 8px 0; display: flex; align-items: center; justify-content: center;">
        <span style="color: #512da8; font-weight: 500;">Expanded</span>
      </div>
    `,
    attributes: { class: 'fa fa-expand' },
  });

  // Padding - Material 3
  editor.BlockManager.add('flutter-padding', {
    label: 'Padding',
    category: layoutCategory,
    content: `
      <div  style="padding: 24px; background: #f5f5f5; border-radius: 12px; margin: 16px 0;">
        <div style="background: #bbdefb; padding: 12px; border-radius: 8px; text-align: center; color: #1976d2; font-weight: 500;">Padded Content</div>
      </div>
    `,
    attributes: { class: 'fa fa-arrows' },
  });

  // ListView - Lista desplazable Material 3
  editor.BlockManager.add('flutter-listview', {
    label: 'ListView',
    category: layoutCategory,
    content: `
      <div  style="width: 100%; max-height: 320px; overflow-y: auto; background: #f5f5f5; border-radius: 12px; padding: 12px; margin: 16px 0; -webkit-overflow-scrolling: touch;">
        <div style="padding: 16px; margin-bottom: 12px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); font-weight: 500; color: #1976d2;">List Item 1</div>
        <div style="padding: 16px; margin-bottom: 12px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); font-weight: 500; color: #1976d2;">List Item 2</div>
        <div style="padding: 16px; margin-bottom: 12px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); font-weight: 500; color: #1976d2;">List Item 3</div>
        <div style="padding: 16px; margin-bottom: 12px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); font-weight: 500; color: #1976d2;">List Item 4</div>
        <div style="padding: 16px; margin-bottom: 0; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); font-weight: 500; color: #1976d2;">List Item 5</div>
      </div>
    `,
    attributes: { class: 'fa fa-list' },
  });

  // GridView - Cuadrícula Material 3
  editor.BlockManager.add('flutter-gridview', {
    label: 'GridView',
    category: layoutCategory,
    content: `
      <div  style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; width: 100%; padding: 12px; background: #f5f5f5; border-radius: 12px; margin: 16px 0;">
        <div style="background: #bbdefb; border-radius: 12px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #1976d2;">Grid 1</div>
        <div style="background: #c8e6c9; border-radius: 12px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #388e3c;">Grid 2</div>
        <div style="background: #ffe082; border-radius: 12px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #fbc02d;">Grid 3</div>
        <div style="background: #f8bbd0; border-radius: 12px; height: 80px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #c2185b;">Grid 4</div>
      </div>
    `,
    attributes: { class: 'fa fa-th' },
  });

  // SizedBox - Caja con tamaño específico Material 3
  editor.BlockManager.add('flutter-sizedbox', {
    label: 'SizedBox',
    category: layoutCategory,
    content: `
      <div  style="width: 80px; height: 80px; background: #f5f5f5; border: 2px dashed #bdbdbd; border-radius: 8px; margin: 16px auto; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 1rem; color: #757575;">SizedBox</span>
      </div>
    `,
    attributes: { class: 'fa fa-square' },
  });

  // Wrap - Disposición horizontal con salto de línea Material 3
  editor.BlockManager.add('flutter-wrap', {
    label: 'Wrap',
    category: layoutCategory,
    content: `
      <div " style="display: flex; flex-wrap: wrap; gap: 12px; width: 100%; padding: 12px; background: #f5f5f5; border-radius: 12px; margin: 16px 0;">
        <div style="min-width: 70px; height: 36px; background: #90caf9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #1976d2;">Item 1</div>
        <div style="min-width: 90px; height: 36px; background: #9fa8da; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #3949ab;">Item 2</div>
        <div style="min-width: 80px; height: 36px; background: #a5d6a7; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #388e3c;">Item 3</div>
        <div style="min-width: 60px; height: 36px; background: #ffcc80; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #f57c00;">Item 4</div>
        <div style="min-width: 100px; height: 36px; background: #ef9a9a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #c62828;">Item 5</div>
      </div>
    `,
    attributes: { class: 'fa fa-th-large' },
  });

  // Center - Centrado Material 3
  editor.BlockManager.add('flutter-center', {
    label: 'Center',
    category: layoutCategory,
    content: `
      <div  style="display: flex; align-items: center; justify-content: center; background: #f5f5f5; width: 100%; height: 100px; border-radius: 12px; margin: 16px 0;">
        <div style="width: 70px; height: 70px; background: #b39ddb; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600;">Center</div>
      </div>
    `,
    attributes: { class: 'fa fa-align-center' },
  });

  // Align - Alineación Material 3
  editor.BlockManager.add('flutter-align', {
    label: 'Align',
    category: layoutCategory,
    content: `
      <div  style="position: relative; width: 100%; height: 120px; background: #f5f5f5; border-radius: 12px; margin: 16px 0;">
        <div style="position: absolute; top: 12px; right: 12px; width: 50px; height: 50px; background: #ff8a65; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600;">TR</div>
      </div>
    `,
    attributes: { class: 'fa fa-align-justify' },
  });

  // AspectRatio - Proporción de aspecto fija Material 3
  editor.BlockManager.add('flutter-aspect-ratio', {
    label: 'AspectRatio',
    category: layoutCategory,
    content: `
      <div  style="width: 100%; position: relative; padding-top: 56.25%; background: #f5f5f5; border-radius: 12px; overflow: hidden; margin: 16px 0;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 1.1rem; color: #757575;">16:9</span>
        </div>
      </div>
    `,
    attributes: { class: 'fa fa-television' },
  });

  // SafeArea - Área segura Material 3
  editor.BlockManager.add('flutter-safe-area', {
    label: 'SafeArea',
    category: layoutCategory,
    content: `
      <div  style="width: 100%; padding: 24px 16px; background: #e8eaf6; border-radius: 12px; margin: 16px 0; border: 2px dashed #9fa8da;">
        <div style="text-align: center; font-size: 1rem; color: #3949ab; font-weight: 500;">
          SafeArea Content<br>
          <span style="font-size: 0.9rem; color: #757575;">(Evita intrusiones del sistema)</span>
        </div>
      </div>
    `,
    attributes: { class: 'fa fa-shield' },
  });

  // Flexible - Material 3
  editor.BlockManager.add('flutter-flexible', {
    label: 'Flexible',
    category: layoutCategory,
    content: `
      <div id="flutter-flexible" style="flex: 2; background: #ffe082; min-height: 40px; border-radius: 12px; padding: 12px; margin: 8px 0; display: flex; align-items: center; justify-content: center;">
        <span style="color: #fbc02d; font-weight: 500;">Flexible (flex: 2)</span>
      </div>
    `,
    attributes: { class: 'fa fa-arrows-h' },
  });

  // SingleChildScrollView - Vista desplazable Material 3
  editor.BlockManager.add('flutter-single-child-scroll-view', {
    label: 'SingleChildScrollView',
    category: layoutCategory,
    content: `
      <div id="flutter-single-child-scroll-view" style="width: 100%; max-height: 180px; overflow-y: auto; background: #f5f5f5; border-radius: 12px; padding: 12px; margin: 16px 0; -webkit-overflow-scrolling: touch;">
        <div style="background: #fff; padding: 16px; border-radius: 12px;">
          <div style="margin-bottom: 12px; font-weight: 600; color: #1976d2;">Scrollable Content</div>
          <div style="height: 200px; display: flex; flex-direction: column; justify-content: space-between; color: #757575;">
            <div>Esto es la parte superior del contenido.</div>
            <div>Esto es el medio del contenido.</div>
            <div>Esto es la parte inferior del contenido.</div>
          </div>
        </div>
      </div>
    `,
    attributes: { class: 'fa fa-arrows-v' },
  });
}