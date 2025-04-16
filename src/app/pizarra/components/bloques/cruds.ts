export function addCrudsBlocks(editor:any){

    editor.BlockManager.add('form-category', {
        label: 'Create Form',
        category: 'Cruds',
        content: `
          <form style="padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
            <h3 style="margin-bottom: 15px;">Formulario</h3>
            <div style="margin-bottom: 10px;">
              <label for="name" style="display: block; margin-bottom: 5px;">Nombre:</label>
              <input type="text" id="name" name="name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label for="email" style="display: block; margin-bottom: 5px;">Correo Electrónico:</label>
              <input type="email" id="email" name="email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label for="password" style="display: block; margin-bottom: 5px;">Contraseña:</label>
              <input type="password" id="password" name="password" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label for="gender" style="display: block; margin-bottom: 5px;">Género:</label>
              <select id="gender" name="gender" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">Preferencias:</label>
              <label><input type="checkbox" name="preference" value="news"> Recibir noticias</label><br>
              <label><input type="checkbox" name="preference" value="updates"> Recibir actualizaciones</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">Estado Civil:</label>
              <label><input type="radio" name="marital_status" value="single"> Soltero</label><br>
              <label><input type="radio" name="marital_status" value="married"> Casado</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label for="message" style="display: block; margin-bottom: 5px;">Mensaje:</label>
              <textarea id="message" name="message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>
            <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Enviar</button>
          </form>
        `,
        attributes: { class: 'fa fa-wpforms' }
      });


}