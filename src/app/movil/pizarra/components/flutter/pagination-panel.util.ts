// src/app/movil/pizarra/components/flutter/pagination-panel.util.ts
// Utilidad para agregar el panel lateral de paginación (Block Manager) a GrapesJS

import { LayoutPosition } from "@grapesjs/studio-sdk";

export function addPaginationPanel(editor: any, pizarraComponent: any) {
  // Añadir el botón al panel izquierdo (views)
  editor.Panels.addButton('views', {
    id: 'open-pagination-panel',
    className: 'fa fa-file-circle-plus', // Icono FontAwesome
    
    attributes: { title: 'Páginas' },
    command: 'open-pagination-panel',
    togglable: true,
  });

  // Añadir el comando para mostrar/ocultar el panel lateral derecho
  editor.Commands.add('open-pagination-panel', {
    run: (editor: any) => {
      let panel = document.getElementById('pagination-panel');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'pagination-panel';
        panel.className = 'panel__pagination';
        
        // Estilos para panel derecho
        panel.style.position = 'fixed';
        panel.style.top = '0';
        panel.style.right = '0'; // Cambiado a right
        panel.style.width = '230px';
        panel.style.height = '100vh';
        panel.style.zIndex = '9999';
        panel.style.background = 'rgb(68,68,68)';
        panel.style.borderLeft = '1.5px solid #e0e0e0'; // Cambiado a borderLeft
        panel.style.boxShadow = '-2px 0 12px rgba(0,0,0,0.08)'; // Sombra hacia la izquierda
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.alignItems = 'center';
        panel.style.padding = '24px 0 18px 0';
        panel.style.overflowY = 'auto';
        panel.style.marginTop = '40px';
        
        // Asegurarse de que aparece sobre el contenido
        panel.style.transform = 'translateX(0)';
        panel.style.transition = 'transform 0.3s ease';
        
        document.body.appendChild(panel);
      }
      // Renderizar el contenido del paginador
      renderPaginationPanel(panel, pizarraComponent);
      panel.style.display = 'flex';
      panel.style.transform = 'translateX(0)'; // Mostrar deslizando desde la derecha
    },
    stop: (editor: any) => {
      const panel = document.getElementById('pagination-panel');
      if (panel) {
        // Ocultar deslizando hacia la derecha
        panel.style.transform = 'translateX(100%)';
        setTimeout(() => {
          panel.style.display = 'none';
        }, 300); // Coincide con la duración de la transición
      } 
    },
  });
}

function renderPaginationPanel(panel: HTMLElement, pizarraComponent: any) {
  panel.innerHTML = '';
  const blockContainer = document.createElement('div');
  blockContainer.style.display = 'flex';
  blockContainer.style.flexDirection = 'column';
  blockContainer.style.gap = '12px';
  blockContainer.style.alignItems = 'center';
  blockContainer.style.width = '100%';

  // Renderiza cada página como bloque visual
  for (let i = 0; i < pizarraComponent.pages.length; i++) {
    const block = document.createElement('div');
    block.className = 'block-manager-page';
    block.style.width = '200px';
    block.style.height = '40px';
    block.style.borderRadius = '10px';
    block.style.background = i === pizarraComponent.currentPage ? '#1976d2' : '#f3f3f3';
    block.style.border = i === pizarraComponent.currentPage ? '2.5px solid #1976d2' : '2px solid #bbb';
    block.style.display = 'flex';
    block.style.flexDirection = 'column';
    block.style.alignItems = 'center';
    block.style.justifyContent = 'center';
    block.style.cursor = 'pointer';
    block.style.position = 'relative';
    block.style.transition = 'border 0.2s, background 0.2s';
    block.title = `Página ${i + 1}`;
    // Número de página
    const num = document.createElement('span');
    num.textContent = (i + 1).toString();
    num.style.fontWeight = 'bold';
    num.style.color = i === pizarraComponent.currentPage ? '#fff' : '#1976d2';
    num.style.fontSize = '1.2em';
    block.appendChild(num);
    // Selección de página
    block.onclick = () => {
      if (pizarraComponent.currentPage !== i) {
        pizarraComponent.saveCurrentPage();
        pizarraComponent.currentPage = i;
        pizarraComponent.loadPage(i);
        renderPaginationPanel(panel, pizarraComponent);
        pizarraComponent.notifyPageChange();
      }
    };
    blockContainer.appendChild(block);
  }

  // Bloque especial para crear nueva página
  const addBlock = document.createElement('div');
  addBlock.className = 'block-manager-add';
  addBlock.style.width = '54px';
  addBlock.style.height = '54px';
  addBlock.style.borderRadius = '10px';
  addBlock.style.background = '#e3e3e3';
  addBlock.style.border = '2px dashed #1976d2';
  addBlock.style.display = 'flex';
  addBlock.style.alignItems = 'center';
  addBlock.style.justifyContent = 'center';
  addBlock.style.cursor = 'pointer';
  addBlock.title = 'Nueva página';
  addBlock.innerHTML = '<i class="fa fa-plus" style="color:#1976d2;font-size:1.5em;"></i>';
  addBlock.onclick = () => {
    pizarraComponent.saveCurrentPage();
    pizarraComponent.pages.push('<p>Nueva Página</p>');
    pizarraComponent.pagescss.push('<style></style>');
    pizarraComponent.currentPage = pizarraComponent.pages.length - 1;
    pizarraComponent.loadPage(pizarraComponent.currentPage);
    renderPaginationPanel(panel, pizarraComponent);
    pizarraComponent.notifyPageChange();
  };
  blockContainer.appendChild(addBlock);

  panel.appendChild(blockContainer);
}
