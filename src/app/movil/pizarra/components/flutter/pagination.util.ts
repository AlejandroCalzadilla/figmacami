// src/app/movil/pizarra/components/flutter/pagination.util.ts
// Utilidad para paginación de la pizarra Flutter

export function updatePagination(
  pages: string[],
  pagescss: string[],
  currentPage: number,
  saveCurrentPage: () => void,
  loadPage: (pageIndex: number) => void,
  notifyPageChange: () => void
) {
  const paginationPanel = document.getElementById('pagination-panel');
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
      updatePagination(pages, pagescss, currentPage, saveCurrentPage, loadPage, notifyPageChange);
      notifyPageChange();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < pages.length - 1) {
      saveCurrentPage();
      currentPage++;
      loadPage(currentPage);
      updatePagination(pages, pagescss, currentPage, saveCurrentPage, loadPage, notifyPageChange);
      notifyPageChange();
    }
  };

  addBtn.onclick = () => {
    saveCurrentPage();
    pages.push('<p>Nueva Página</p>');
    pagescss.push('<style></style>');
    currentPage = pages.length - 1;
    loadPage(currentPage);
    updatePagination(pages, pagescss, currentPage, saveCurrentPage, loadPage, notifyPageChange);
    notifyPageChange();
  };
}

export function saveCurrentPage(pages: string[], pagescss: string[], currentPage: number, editor: any) {
  pages[currentPage] = editor.getHtml();
  pagescss[currentPage] = editor.getCss();
}

export function loadPage(pages: string[], pagescss: string[], pageIndex: number, editor: any) {
  const page = pages[pageIndex];
  if (page) {
    const estilosycss = {
      styles: pagescss[pageIndex],
      components: pages[pageIndex]
    };
    editor.setComponents(estilosycss);
  }
}
