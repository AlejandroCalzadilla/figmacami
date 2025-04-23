export function addCrudsBlocks(editor:any){

    editor.BlockManager.add('form-create', {
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





      editor.BlockManager.add('form-edit', {
        label: 'Edit Form',
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



      editor.BlockManager.add('table-view', {
        label: 'View Records',
        category: 'Cruds',
        content: `
          <div style="padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
            <h3 style="margin-bottom: 15px;">Registros</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 10px; border: 1px solid #ccc;">Nombre</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">Correo Electrónico</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">Género</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">Preferencias</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">Estado Civil</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ccc;">Juan Pérez</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">juan.perez@example.com</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Masculino</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Recibir noticias</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Soltero</td>
                  <td style="padding: 10px; border: 1px solid #ccc; display: flex; gap: 5px;">
                    <button style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Editar</button>
                    <button style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>
                       <button style="padding: 5px 10px; background-color: green; color: white; border: none; border-radius: 4px; cursor: pointer;">Ver</button>
                 
                    </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ccc;">Ana López</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">ana.lopez@example.com</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Femenino</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Recibir actualizaciones</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Casado</td>
                  <td style="padding: 10px; border: 1px solid #ccc ;display: flex; gap: 5px; ">
                    <button style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Editar</button>
                    <button style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>
                    <button style="padding: 5px 10px; background-color: green; color: white; border: none; border-radius: 4px; cursor: pointer;">Ver</button>
                  
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
        attributes: { class: 'fa fa-table' }
      });
      editor.BlockManager.add('view-record', {
        label: 'View Record',
        category: 'Cruds',
        content: `
          <div style="padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9; max-width: 100%; max-height:100% margin: 0 auto;">
            <h3 style="margin-bottom: 15px; text-align: center;">Detalles del Registro</h3>
            <div style="margin-bottom: 10px;">
              <strong>Nombre:</strong>
              <span style="display: block; margin-top: 5px;">Juan Pérez</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Correo Electrónico:</strong>
              <span style="display: block; margin-top: 5px;">juan.perez@example.com</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Género:</strong>
              <span style="display: block; margin-top: 5px;">Masculino</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Preferencias:</strong>
              <ul style="margin-top: 5px; padding-left: 20px;">
                <li>Recibir noticias</li>
                <li>Recibir actualizaciones</li>
              </ul>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Estado Civil:</strong>
              <span style="display: block; margin-top: 5px;">Soltero</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Mensaje:</strong>
              <p style="margin-top: 5px;">Este es un mensaje de ejemplo.</p>
            </div>
            <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Volver</button>
          </div>
        `,
        attributes: { class: 'fa fa-eye' }
      });

}