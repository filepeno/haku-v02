import Pagination from "tui-pagination";
import { clearResults } from "./search-interface";
import { findAll } from "./full-search";

export function initPagination(q, hits, size, pages, customSite) {
  const container = document.getElementById("tui-pagination-container");
  const pagination = new Pagination(container, {
    totalItems: hits,
    itemsPerPage: size,
    visiblePages: pages,
    template: {
      page: '<button class="tui-page-btn">{{page}}<button>',
      currentPage: '<button class="tui-page-btn tui-is-selected">{{page}}</button>',
      moveButton: '<button class="tui-page-btn tui-{{type}} custom-class-{{type}}" >' + '<span class="tui-ico-{{type}}">{{type}}</span>' + "</button>",
      disabledMoveButton: '<button class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}}">' + '<span class="tui-ico-{{type}}">{{type}}</span>' + "</button>",
      moreButton: '<button class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}}">' + '<span class="tui-ico-ellip">...</span>' + "</button>",
    },
  });
  /*  pagination.movePageTo(currentScope); */
  console.log("current page:", pagination.getCurrentPage());

  pagination.on("afterMove", ({ page }) => {
    console.log("new page:", page);
    clearResults();
    findAll(customSite, q, page);
  });
}
