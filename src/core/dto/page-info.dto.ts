export class PageInfoDto {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_items: number;

  constructor(current_page: number, page_size: number, total_pages: number, total_items: number) {
    this.current_page = current_page;
    this.page_size = page_size;
    this.total_pages = total_pages;
    this.total_items = total_items;
  }

  static of(current_page: number, page_size: number, total_pages: number, total_items: number): PageInfoDto {
    return new PageInfoDto(current_page, page_size, total_pages, total_items);
  }
}