// Definición de componentes de Flutter Widgets para GrapesJS - Inspirados en Material 3
export function addFlutterWidgetComponents(editor: any) {
  const widgetCategory = 'Flutter - Widgets';

  // Text
  editor.BlockManager.add('flutter-text', {
    label: 'Text',
    category: widgetCategory,
    content: `
      <span data-gjs-type="flutter-text" style="font-size: 1.1rem; color: #222; font-weight: 500; letter-spacing: 0.01em;">Texto de ejemplo</span>
    `,
    attributes: { class: 'fa fa-font' },
  });

  // Icon
  editor.BlockManager.add('flutter-icon', {
    label: 'Icon',
    category: widgetCategory,
    content: `
      <span data-gjs-type="flutter-icon" style="font-size: 2rem; color: #1976d2; display: inline-flex; align-items: center; justify-content: center;">★</span>
    `,
    attributes: { class: 'fa fa-star' },
  });

  // Button
  editor.BlockManager.add('flutter-button', {
    label: 'Button',
    category: widgetCategory,
    content: `
      <button data-gjs-type="flutter-button" style="background: #1976d2; color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-size: 1rem; font-weight: 600; box-shadow: 0 2px 4px rgba(25,118,210,0.08); cursor: pointer; transition: background 0.2s;">Botón</button>
    `,
    attributes: { class: 'fa fa-square' },
  });

  // Image
  editor.BlockManager.add('flutter-image', {
    label: 'Image',
    category: widgetCategory,
    content: `
      <img data-gjs-type="flutter-image" src="https://material-foundation.github.io/material-theme-builder/static/media/placeholder.2c7d6b6e.png" alt="Imagen" style="width: 100%; max-width: 240px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); display: block; margin: 0 auto;"/>
    `,
    attributes: { class: 'fa fa-image' },
  });

  

  // Switch
  editor.BlockManager.add('flutter-switch', {
    label: 'Switch',
    category: widgetCategory,
    content: `
      <label  style="display: inline-flex; align-items: center; cursor: pointer; gap: 8px;">
        <input type="checkbox" style="appearance: none; width: 36px; height: 20px; background: #bdbdbd; border-radius: 12px; position: relative; outline: none; transition: background 0.2s;">
        <span style="font-size: 1rem; color: #222;">Switch</span>
      </label>
    `,
    attributes: { class: 'fa fa-toggle-on' },
  });

  // Slider
  editor.BlockManager.add('flutter-slider', {
    label: 'Slider',
    category: widgetCategory,
    content: `
      <input  type="range" min="0" max="100" value="50" style="width: 180px; accent-color: #1976d2; margin: 8px 0;">
    `,
    attributes: { class: 'fa fa-sliders' },
  });

  // Divider
  editor.BlockManager.add('flutter-divider', {
    label: 'Divider',
    category: widgetCategory,
    content: `
      <hr  style="border: none; border-top: 2px solid #e0e0e0; margin: 16px 0;"/>
    `,
    attributes: { class: 'fa fa-minus' },
  });

  // CircleAvatar
  editor.BlockManager.add('flutter-circle-avatar', {
    label: 'CircleAvatar',
    category: widgetCategory,
    content: `
      <img  src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; box-shadow: 0 1px 4px rgba(0,0,0,0.10);"/>
    `,
    attributes: { class: 'fa fa-user-circle' },
  });

  // FloatingActionButton
  editor.BlockManager.add('flutter-fab', {
    label: 'FloatingActionButton',
    category: widgetCategory,
    content: `
      <button  style="width: 56px; height: 56px; border-radius: 50%; background: #1976d2; color: #fff; border: none; box-shadow: 0 4px 12px rgba(25,118,210,0.18); font-size: 2rem; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer;">
        ＋
      </button>
    `,
    attributes: { class: 'fa fa-plus-circle' },
  });

  // Checkbox
  editor.BlockManager.add('flutter-checkbox', {
    label: 'Checkbox',
    category: widgetCategory,
    content: `
      <label  style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
        <input type="checkbox" style="width: 20px; height: 20px; accent-color: #1976d2;">
        <span style="font-size: 1rem; color: #222;">Checkbox</span>
      </label>
    `,
    attributes: { class: 'fa fa-check-square' },
  });

  // Radio
  editor.BlockManager.add('flutter-radio', {
    label: 'Radio',
    category: widgetCategory,
    content: `
      <label  style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
        <input type="radio" name="radio-group" style="width: 20px; height: 20px; accent-color: #1976d2;">
        <span style="font-size: 1rem; color: #222;">Radio</span>
      </label>
    `,
    attributes: { class: 'fa fa-dot-circle-o' },
  });

  // ListTile
  editor.BlockManager.add('flutter-listtile', {
    label: 'ListTile',
    category: widgetCategory,
    content: `
      <div  style="display: flex; align-items: center; gap: 16px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); padding: 12px 20px; margin: 8px 0;">
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

  // Chip
  editor.BlockManager.add('flutter-chip', {
    label: 'Chip',
    category: widgetCategory,
    content: `
      <span  style="display: inline-flex; align-items: center; gap: 6px; background: #e3f2fd; color: #1976d2; border-radius: 16px; padding: 6px 16px; font-size: 1rem; font-weight: 500; margin: 4px 0;">Chip</span>
    `,
    attributes: { class: 'fa fa-tag' },
  });

  // ProgressIndicator
  editor.BlockManager.add('flutter-progress-indicator', {
    label: 'ProgressIndicator',
    category: widgetCategory,
    content: `
      <div  style="width: 100%; max-width: 220px; height: 6px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin: 12px 0;">
        <div style="width: 60%; height: 100%; background: #1976d2; border-radius: 4px;"></div>
      </div>
    `,
    attributes: { class: 'fa fa-spinner' },
  });
}
