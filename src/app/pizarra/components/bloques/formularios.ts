export function addFormsBlocks(editor: any) {


    editor.BlockManager.add('form-text', {
        label: 'Campo de Texto',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="text-input" style="display: block; margin-bottom: 5px;">Texto:</label>
            <input type="text" id="text-input" name="text-input" style="width: 10%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-font' }
      });
      
      editor.BlockManager.add('form-email', {
        label: 'Correo Electrónico',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="email-input" style="display: block; margin-bottom: 5px;">Correo Electrónico:</label>
            <input type="email" id="email-input" name="email-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-envelope' }
      });
      
      editor.BlockManager.add('form-password', {
        label: 'Contraseña',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="password-input" style="display: block; margin-bottom: 5px;">Contraseña:</label>
            <input type="password" id="password-input" name="password-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-lock' }
      });
      
      editor.BlockManager.add('form-select', {
        label: 'Selector',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="select-input" style="display: block; margin-bottom: 5px;">Selecciona una opción:</label>
            <select id="select-input" name="select-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="option1">Opción 1</option>
              <option value="option2">Opción 2</option>
              <option value="option3">Opción 3</option>
            </select>
          </div>
        `,
        attributes: { class: 'fa fa-list' }
      });
      
      editor.BlockManager.add('form-checkbox', {
        label: 'Casilla de Verificación',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Selecciona una opción:</label>
            <label><input type="checkbox" name="checkbox1" value="option1"> Opción 1</label><br>
            <label><input type="checkbox" name="checkbox2" value="option2"> Opción 2</label>
          </div>
        `,
        attributes: { class: 'fa fa-check-square' }
      });
      
      editor.BlockManager.add('form-radio', {
        label: 'Botón de Radio',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Selecciona una opción:</label>
            <label><input type="radio" name="radio-group" value="option1"> Opción 1</label><br>
            <label><input type="radio" name="radio-group" value="option2"> Opción 2</label>
          </div>
        `,
        attributes: { class: 'fa fa-circle' }
      });
      
      editor.BlockManager.add('form-button', {
        label: 'Botón',
        category: 'Formularios',
        content: `
          <button type="button" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Botón
          </button>
        `,
        attributes: { class: 'fa fa-stop' }
      });


      editor.BlockManager.add('form-date', {
        label: 'Campo de Fecha',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="date-input" style="display: block; margin-bottom: 5px;">Fecha:</label>
            <input type="date" id="date-input" name="date-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-calendar' }
      });

      editor.BlockManager.add('form-container', {
        label: 'Contenedor de Formulario',
        category: 'Formularios',
        content: `
          <form style="padding: 20px; border: 2px dashed #ccc; background-color: #f9f9f9; border-radius: 8px;">
            <h3 style="margin-bottom: 15px; text-align: center; color: #333;">Contenedor de Formulario</h3>
            <div style="min-height: 100px; border: 1px dashed #ddd; padding: 10px; background-color: #fff;">
             
            </div>
          </form>
        `,
        attributes: { class: 'fa fa-square' }
      });







}