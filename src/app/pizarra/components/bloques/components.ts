export function addComponentesBlocks(editor:any){
    editor.BlockManager.add('custom-table', {
        label: 'Tabla Personalizada',
        category: 'Componentes',
        content: `
          <table style="width: 250px; border-collapse: collapse; border: 2px solid #333;">
            <thead>
              <tr>
                <th style="border: 1px solid #333; padding: 8px; background-color: #f0f0f0;">Encabezado 1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #333; padding: 8px;">Celda</td>
              </tr>
            </tbody>
          </table>
        `,
        attributes: { class: 'fa fa-table' },
        // Esto es importante para que GrapesJS lo trate como DOM editable
        activate: true,
      });

      
      editor.on('component:add', (component:any) => {
        const tagName = component.get('tagName');
        if (tagName === 'td' || tagName === 'th') {
          component.set({
            type: 'text', // permite edición
            editable: true,
          });
        }
        });



      



    // Comando para agregar una fila
    editor.Commands.add('add-row', {
        run(editor: any) {
          const selected = editor.getSelected();
          if (selected && selected.is('table')) {
            const tbody = selected.find('tbody')[0];
            if (tbody) {
              const rows = tbody.components();
              // Verificar si hay al menos una fila existente
              if (rows.length > 0) {
                const firstRow = rows.at(0); // Obtener la primera fila
                const newRow = firstRow.clone(); // Clonar la primera fila
                newRow.components().each((cell: any) => {
                  cell.set('content', 'Nueva Celda'); // Reiniciar el contenido de las celdas
                });
                // Agregar la nueva fila al tbody
                rows.add(newRow);
                console.log('Fila agregada con éxito. Total de filas:', rows.length);
              } else {
                // Si no hay filas, crear una nueva fila con 2 columnas por defecto
                const defaultRow = {
                  type: 'tr',
                  components: [
                    {
                      type: 'td',
                      content: 'Nueva Celda',
                      style: {
                        border: '1px solid #333',
                        padding: '8px',
                      },
                    },
                    {
                      type: 'td',
                      content: 'Nueva Celda',
                      style: {
                        border: '1px solid #333',
                        padding: '8px',
                      },
                    },
                  ],
                };
                rows.add(defaultRow);
                console.log('No había filas existentes. Se agregó una fila por defecto.');
              }
            } else {
              alert('La tabla seleccionada no tiene un <tbody>.');
            }
          } else {
            alert('Por favor, selecciona una tabla.');
          }
        },
      });

    // Comando para agregar una columna
    editor.Commands.add('add-column', {
        run(editor: any) {
          const selected = editor.getSelected();
          if (selected && selected.is('table')) {
            const rows = selected.find('tr'); // Obtener todas las filas de la tabla
            if (rows.length > 0) {
              console.log('Agregando columna a la tabla...');
              rows.forEach((row: any) => {
                const cells = row.components(); // Obtener las celdas de la fila
                if (cells.length > 0) {
                  const lastCell = cells.at(cells.length - 1); // Obtener la última celda
                  const newCell = lastCell.clone(); // Clonar la última celda
                  newCell.set('content', 'Nueva Columna'); // Reiniciar el contenido de la celda clonada
                  row.components().add(newCell); // Agregar la celda clonada a la fila
                } else {
                  // Si no hay celdas, agregar una celda por defecto
                  row.components().add({
                    type: 'td',
                    content: 'Nueva Columna',
                    style: {
                      border: '1px solid #333',
                      padding: '8px',
                    },
                  });
                }
              });
              console.log('Columna agregada con éxito.');
            } else {
              alert('La tabla seleccionada no tiene filas.');
            }
          } else {
            alert('Por favor, selecciona una tabla.');
          }
        },
      });



    // Agregar botones al panel de herramientas
    editor.Panels.addButton('options', [
      {
        id: 'add-row',
        className: 'fa fa-plus',
        command: 'add-row',
        attributes: { title: 'Agregar Fila' },
      },
      {
        id: 'add-column',
        className: 'fa fa-columns',
        command: 'add-column',
        attributes: { title: 'Agregar Columna' },
      },
    ]);


     


  



      editor.BlockManager.add('custom-navbar', {
        label: 'Navbar',
        content: `
          <nav style="background-color: #333; color: white; padding: 10px;">
            <a href="#" style="color: white; margin-right: 10px;">Home</a>
            <a href="#" style="color: white; margin-right: 10px;">About</a>
            <a href="#" style="color: white;">Contact</a>
          </nav>
        `,
        category: 'Componentes',
        attributes: { class: 'fa fa-bars' }
      });

      editor.BlockManager.add('custom-heading', {
        label: 'Título Personalizado',
        category: 'Componentes',
        content: '<h1 style="color: #2c3e50; font-family: Arial, sans-serif;">Título Principal</h1>',
        attributes: { class: 'fa fa-header' }
      });

      editor.BlockManager.add('custom-aside', {
        label: 'Sidebar',
        category: 'Componentes',
        content: `
          <div style="display: flex; height: 100vh;">
            <aside style="width: 250px; background-color: #333; color: white; padding: 15px; box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);">
              <h3 style="margin-top: 0; color: #fff;">Menú</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px;">
                  <a href="#" style="color: white; text-decoration: none; display: block; padding: 10px; background-color: #444; border-radius: 4px;">Inicio</a>
                </li>
                <li style="margin-bottom: 10px;">
                  <a href="#" style="color: white; text-decoration: none; display: block; padding: 10px; background-color: #444; border-radius: 4px;">Servicios</a>
                </li>
                <li style="margin-bottom: 10px;">
                  <a href="#" style="color: white; text-decoration: none; display: block; padding: 10px; background-color: #444; border-radius: 4px;">Acerca de</a>
                </li>
                <li style="margin-bottom: 10px;">
                  <a href="#" style="color: white; text-decoration: none; display: block; padding: 10px; background-color: #444; border-radius: 4px;">Contacto</a>
                </li>
              </ul>
            </aside>
            <main style="flex: 1; padding: 20px;">
              <h1 style="color: #333;">Contenido Principal</h1>
              <p style="color: #555;">Aquí va el contenido principal de la página.</p>
            </main>
          </div>
        `,
        attributes: { class: 'fa fa-bars' }
      });




}