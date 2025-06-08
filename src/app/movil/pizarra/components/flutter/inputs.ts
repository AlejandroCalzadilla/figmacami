// Definición de componentes de Flutter Inputs para GrapesJS - Inspirados en Material 3
export function addFlutterInputComponents(editor: any) {
  const inputCategory = 'Flutter - Inputs';

  // TextField
  editor.BlockManager.add('flutter-input-textfield', {
    label: 'TextField',
    category: inputCategory,
    content: `
      <input data-gjs-type="flutter-input-textfield" type="text" placeholder="Escribe algo..." style="width: 100%; max-width: 320px; padding: 12px 16px; border: 1.5px solid #bdbdbd; border-radius: 8px; font-size: 1rem; background: #fff; color: #222; outline: none; margin: 8px 0; transition: border 0.2s;"/>
    `,
    attributes: { class: 'fa fa-i-cursor' },
  });

  // TextArea
  editor.BlockManager.add('flutter-input-textarea', {
    label: 'TextArea',
    category: inputCategory,
    content: `
      <textarea data-gjs-type="flutter-input-textarea" placeholder="Texto largo..." rows="3" style="width: 100%; max-width: 320px; padding: 12px 16px; border: 1.5px solid #bdbdbd; border-radius: 8px; font-size: 1rem; background: #fff; color: #222; outline: none; margin: 8px 0; resize: vertical; transition: border 0.2s;"></textarea>
    `,
    attributes: { class: 'fa fa-align-left' },
  });

  // Checkbox
  editor.BlockManager.add('flutter-input-checkbox', {
    label: 'Checkbox',
    category: inputCategory,
    content: `
      <label data-gjs-type="flutter-input-checkbox" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
        <input type="checkbox" style="width: 20px; height: 20px; accent-color: #1976d2;">
        <span style="font-size: 1rem; color: #222;">Checkbox</span>
      </label>
    `,
    attributes: { class: 'fa fa-check-square' },
  });

  // Radio
  editor.BlockManager.add('flutter-input-radio', {
    label: 'Radio',
    category: inputCategory,
    content: `
      <label data-gjs-type="flutter-input-radio" style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
        <input type="radio" name="input-radio-group" style="width: 20px; height: 20px; accent-color: #1976d2;">
        <span style="font-size: 1rem; color: #222;">Radio</span>
      </label>
    `,
    attributes: { class: 'fa fa-dot-circle-o' },
  });

  // Switch
  editor.BlockManager.add('flutter-input-switch', {
    label: 'Switch',
    category: inputCategory,
    content: `
      <label data-gjs-type="flutter-input-switch" style="display: inline-flex; align-items: center; cursor: pointer; gap: 8px;">
        <input type="checkbox" style="appearance: none; width: 36px; height: 20px; background: #bdbdbd; border-radius: 12px; position: relative; outline: none; transition: background 0.2s;">
        <span style="font-size: 1rem; color: #222;">Switch</span>
      </label>
    `,
    attributes: { class: 'fa fa-toggle-on' },
  });

  // Slider
  editor.BlockManager.add('flutter-input-slider', {
    label: 'Slider',
    category: inputCategory,
    content: `
      <input data-gjs-type="flutter-input-slider" type="range" min="0" max="100" value="50" style="width: 180px; accent-color: #1976d2; margin: 8px 0;">
    `,
    attributes: { class: 'fa fa-sliders' },
  });

  // DatePicker
  editor.BlockManager.add('flutter-input-datepicker', {
    label: 'DatePicker',
    category: inputCategory,
    content: `
      <input  type="date" style="width: 100%; max-width: 200px; padding: 12px 16px; border: 1.5px solid #bdbdbd; border-radius: 8px; font-size: 1rem; background: #fff; color: #222; outline: none; margin: 8px 0;">
    `,
    attributes: { class: 'fa fa-calendar' },
  });

  // TimePicker
  editor.BlockManager.add('flutter-input-timepicker', {
    label: 'TimePicker',
    category: inputCategory,
    content: `
      <input  type="time" style="width: 100%; max-width: 160px; padding: 12px 16px; border: 1.5px solid #bdbdbd; border-radius: 8px; font-size: 1rem; background: #fff; color: #222; outline: none; margin: 8px 0;">
    `,
    attributes: { class: 'fa fa-clock-o' },
  });

  // Dropdown
  editor.BlockManager.add('flutter-input-dropdown', {
    label: 'Dropdown',
    category: inputCategory,
    content: `
      <select  style="width: 100%; max-width: 220px; padding: 12px 16px; border: 1.5px solid #bdbdbd; border-radius: 8px; font-size: 1rem; background: #fff; color: #222; outline: none; margin: 8px 0;">
        <option>Opción 1</option>
        <option>Opción 2</option>
        <option>Opción 3</option>
      </select>
    `,
    attributes: { class: 'fa fa-caret-down' },
  });

  // FilePicker
  editor.BlockManager.add('flutter-input-filepicker', {
    label: 'FilePicker',
    category: inputCategory,
    content: `
      <input  type="file" style="margin: 8px 0;">
    `,
    attributes: { class: 'fa fa-paperclip' },
  });
}
