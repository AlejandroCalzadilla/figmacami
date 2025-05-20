export function addCrudsBlocks(editor:any){

    editor.BlockManager.add('form-create', {
        label: 'Create Form',
        category: 'Cruds',
        content: `
          <form style="padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
            <h3 style="margin-bottom: 15px;">Formulario</h3>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">nombre</label>
              <input type="text" id="name"  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">correo</label>
              <input type="email" id="email"  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">contrasena</label>
              <input type="password" id="password" name="password" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">genero</label>
              <select   style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">preferencia</label>
              <label><input type="checkbox"  value="nuevas"> Recibir noticias</label><br>
              <label><input type="checkbox"  value="actualizaciones"> Recibir actualizaciones</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">estado_civil</label>
              <label><input type="radio"  value="soltero"> Soltero</label><br>
              <label><input type="radio"  value="casado"> Casado</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">mensaje</label>
              <textarea id="message"  rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>
          <button  id="crear" type="submit" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;" contenteditable="false"> Crear</button>
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
              <label  style="display: block; margin-bottom: 5px;">nombre</label>
              <input type="text" id="name"  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">correo</label>
              <input type="email" id="email"  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">contrasena</label>
              <input type="password" id="password"  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">genero</label>
              <select id="gender"  style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="masculino">masculino</option>
                <option value="femenino">femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">preferencias</label>
              <label><input type="checkbox"  value="nuevas"> Recibir noticias</label><br>
              <label><input type="checkbox"  value="actualizaciones">Recibir actualizaciones</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">estado_civil</label>
              <label><input type="radio" value="soltero"> Soltero</label><br>
              <label><input type="radio"  value="casado"> Casado</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label  style="display: block; margin-bottom: 5px;">mensaje</label>
              <textarea id="message"  rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>
           <button  id="editar" type="submit" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;" contenteditable="false"> editar</button>
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
            <table id="vistaregistro" style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 10px; border: 1px solid #ccc;">nombre</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">correo</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">genero</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">preferencias</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">estado_civil</th>
                  <th style="padding: 10px; border: 1px solid #ccc;">acciones</th>
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
                     <button style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">ver</button>
                    <button style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">editar</button>
                    <button style="padding: 5px 10px; background-color: green; color: white; border: none; border-radius: 4px; cursor: pointer;">eliminar</button>
                  
                   </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ccc;">Ana López</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">ana.lopez@example.com</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Femenino</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Recibir actualizaciones</td>
                  <td style="padding: 10px; border: 1px solid #ccc;">Casado</td>
                  <td style="padding: 10px; border: 1px solid #ccc ;display: flex; gap: 5px; ">
                    <button style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">editar</button>
                    <button style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">eliminar</button>
                    <button style="padding: 5px 10px; background-color: green; color: white; border: none; border-radius: 4px; cursor: pointer;">ver</button>
                  
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
          <div  id="vistaregistro" style="padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9; max-width: 100%; max-height:100% margin: 0 auto;">
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
            <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">volver</button>
          </div>
        `,
        attributes: { class: 'fa fa-eye' }
      });

}