// Definición de componentes de Flutter Material para GrapesJS - Inspirados en Material 3
export function addFlutterMaterialComponents(editor: any) {
  const materialCategory = 'Flutter - Material';

  // Card
  editor.BlockManager.add('flutter-material-card', {
    label: 'Card',
    category: materialCategory,
    content: `
      <div data-gjs-type="flutter-material-card" style="background: #fff; border-radius: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 24px 20px; margin: 16px 0; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 1.2rem; font-weight: 600; color: #1976d2;">Título de la tarjeta</div>
        <div style="color: #444; font-size: 1rem;">Contenido de la tarjeta Material 3. Puedes arrastrar widgets aquí.</div>
        <button style="align-self: flex-end; background: #1976d2; color: #fff; border: none; border-radius: 8px; padding: 8px 20px; font-size: 1rem; font-weight: 600; cursor: pointer;">Acción</button>
      </div>
    `,
    attributes: { class: 'fa fa-clone' },
  });

  // Chip
  editor.BlockManager.add('flutter-material-chip', {
    label: 'Chip',
    category: materialCategory,
    content: `
      <span data-gjs-type="flutter-material-chip" style="display: inline-flex; align-items: center; gap: 6px; background: #e3f2fd; color: #1976d2; border-radius: 16px; padding: 6px 16px; font-size: 1rem; font-weight: 500; margin: 4px 0;">Chip</span>
    `,
    attributes: { class: 'fa fa-tag' },
  });

  // Divider
  editor.BlockManager.add('flutter-material-divider', {
    label: 'Divider',
    category: materialCategory,
    content: `
      <hr data-gjs-type="flutter-material-divider" style="border: none; border-top: 2px solid #e0e0e0; margin: 16px 0;"/>
    `,
    attributes: { class: 'fa fa-minus' },
  });

  // ProgressIndicator
  editor.BlockManager.add('flutter-material-progress-indicator', {
    label: 'ProgressIndicator',
    category: materialCategory,
    content: `
      <div data-gjs-type="flutter-material-progress-indicator" style="width: 100%; max-width: 220px; height: 6px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin: 12px 0;">
        <div style="width: 60%; height: 100%; background: #1976d2; border-radius: 4px;"></div>
      </div>
    `,
    attributes: { class: 'fa fa-spinner' },
  });

  // FloatingActionButton
  editor.BlockManager.add('flutter-material-fab', {
    label: 'FloatingActionButton',
    category: materialCategory,
    content: `
      <button data-gjs-type="flutter-material-fab" style="width: 56px; height: 56px; border-radius: 50%; background: #1976d2; color: #fff; border: none; box-shadow: 0 4px 12px rgba(25,118,210,0.18); font-size: 2rem; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer;">
        ＋
      </button>
    `,
    attributes: { class: 'fa fa-plus-circle' },
  });

  // ListTile
  editor.BlockManager.add('flutter-material-listtile', {
    label: 'ListTile',
    category: materialCategory,
    content: `
      <div data-gjs-type="flutter-material-listtile" style="display: flex; align-items: center; gap: 16px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); padding: 12px 20px; margin: 8px 0;">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #222;">Título</div>
          <div style="font-size: 0.95rem; color: #757575;">Subtítulo</div>
        </div>
        <span style="font-size: 1.5rem; color: #bdbdbd;">›</span>
      </div>
    `,
    attributes: { class: 'fa fa-list-alt' },
  });

  // CircleAvatar
  editor.BlockManager.add('flutter-material-circle-avatar', {
    label: 'CircleAvatar',
    category: materialCategory,
    content: `
      <img data-gjs-type="flutter-material-circle-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; box-shadow: 0 1px 4px rgba(0,0,0,0.10);"/>
    `,
    attributes: { class: 'fa fa-user-circle' },
  });
}
