import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}

  updatePagination(
    paginationPanelId: string,
    currentPage: number,
    pages: string[],
    saveCurrentPage: () => void,
    loadPage: (pageIndex: number) => void
  ): void {
    const paginationPanel = document.getElementById(paginationPanelId);
    if (!paginationPanel) return;

    paginationPanel.innerHTML = `
      <button id="prev-page" title="Página Anterior"><i class="fa fa-chevron-left"></i></button>
      <span>Página ${currentPage + 1} de ${pages.length}</span>
      <button id="next-page" title="Página Siguiente"><i class="fa fa-chevron-right"></i></button>
      <button id="add-page" title="Nueva Página"><i class="fa fa-plus"></i></button>
    `;

    const prevBtn = document.getElementById('prev-page') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-page') as HTMLButtonElement;
    const addBtn = document.getElementById('add-page') as HTMLButtonElement;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;



    prevBtn.onclick = () => {
      if (currentPage > 0) {
        saveCurrentPage();
        currentPage--;
        loadPage(currentPage);
        this.updatePagination(paginationPanelId, currentPage, pages, saveCurrentPage, loadPage);
      }
    };

    nextBtn.onclick = () => {
      if (currentPage < pages.length - 1) {
        saveCurrentPage();
        currentPage++;
        loadPage(currentPage);
        this.updatePagination(paginationPanelId, currentPage, pages, saveCurrentPage, loadPage);
      }
    };

    addBtn.onclick = () => {
      console.log('Añadiendo nueva página...');
      saveCurrentPage();  
      pages.push('<p>Nueva Página</p>');
      currentPage = pages.length - 1;
      console.log('Página actual:', currentPage, pages[currentPage]);
      loadPage(currentPage);
      this.updatePagination(paginationPanelId, currentPage, pages, saveCurrentPage, loadPage);
    };
  }

  saveCurrentPage(pages: string[], pagescss: string[], currentPage: number, editor: any): void {
    console.log('Guardando página actual...',currentPage ,editor.getHtml()); 
    pages[currentPage] = editor.getHtml();
    pagescss[currentPage] = editor.getCss();
  }

  loadPage(pageIndex: number, pages: string[], pagescss: string[], editor: any): void {
    const page = pages[pageIndex];
    if (page) {
      const estilosycss = {
        styles: pagescss[pageIndex],
        components: pages[pageIndex],
      };
      editor.setComponents(estilosycss);
    }
  }
}