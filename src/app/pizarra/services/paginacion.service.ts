import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {
  private currentPage: number = 0;
  private pages: string[] = ['<p>Page 1</p>'];
  private pagescss: string[] = ['<style>body{background-color: #fff;}</style>'];
  private editor: any;

  setEditor(editor: any) {
    this.editor = editor;
  }

  setPages(pages: string[]) {
    this.pages = pages;
  }

  setPagesCss(pagescss: string[]) {
    this.pagescss = pagescss;
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getPages(): string[] {
    return this.pages;
  }

  getPagesCss(): string[] {
    return this.pagescss;
  }

  updatePagination(): void {
    const paginationPanel = document.getElementById('pagination-panel');
    if (!paginationPanel) return;

    paginationPanel.innerHTML = `
      <button id="prev-page" title="Página Anterior"><i class="fa fa-chevron-left"></i></button>
      <span>Página ${this.currentPage + 1} de ${this.pages.length}</span>
      <button id="next-page" title="Página Siguiente"><i class="fa fa-chevron-right"></i></button>
      <button id="add-page" title="Nueva Página"><i class="fa fa-plus"></i></button>
    `;

    const prevBtn = document.getElementById('prev-page') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-page') as HTMLButtonElement;
    const addBtn = document.getElementById('add-page') as HTMLButtonElement;

    prevBtn.disabled = this.currentPage === 0;
    nextBtn.disabled = this.currentPage === this.pages.length - 1;

    prevBtn.onclick = () => {
      if (this.currentPage > 0) {
        this.saveCurrentPage();
        this.currentPage--;
        this.loadPage(this.currentPage);
        this.updatePagination();
      }
    };

    nextBtn.onclick = () => {
      if (this.currentPage < this.pages.length - 1) {
        this.saveCurrentPage();
        this.currentPage++;
        this.loadPage(this.currentPage);
        this.updatePagination();
      }
    };

    addBtn.onclick = () => {
      this.saveCurrentPage();
      this.pages.push('<p>Nueva Página</p>');
      this.currentPage = this.pages.length - 1;
      this.loadPage(this.currentPage);
      this.updatePagination();
    };
  }

  private saveCurrentPage(): void {
    this.pages[this.currentPage] = this.editor.getHtml();
    this.pagescss[this.currentPage] = this.editor.getCss();
  }

  private loadPage(pageIndex: number): void {
    const page = this.pages[pageIndex];
    if (page) {
      const estilosycss = {
        styles: this.pagescss[pageIndex],
        components: this.pages[pageIndex]
      }
      this.editor.setComponents(estilosycss);
    }
  }
} 