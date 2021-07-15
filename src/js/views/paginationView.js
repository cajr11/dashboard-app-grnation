import { ARROW_LEFT, ARROW_RIGHT } from "../config.js";

export const generateButtonMarkup = function (state) {
  const currPage = state.loaded.page;
  const numPages = Math.ceil(
    state.info.users.length / state.loaded.resultsPerPage
  );

  // Page 1 and there are other pages
  if (currPage === 1 && numPages > 1) {
    return generateMarkupButtonNext(currPage);
  }

  // Last page
  if (currPage === numPages && numPages > 1) {
    return generateMarkupButtonPrevious(currPage);
  }
  // On a page and there are other pages
  if (currPage < numPages) {
    return generateMarkupButtonPrevious(currPage).concat(
      generateMarkupButtonNext(currPage)
    );
  }

  // Page 1 and no other pages
  return "";
};

export const generateMarkupButtonPrevious = function (pageNum) {
  const markup = `
        <button data-goto="${pageNum - 1}"
           class="btn--inline pagination__btn--prev">
              ${ARROW_LEFT}
            <span>Page ${pageNum - 1}</span>
        </button>`;
  return markup;
};

export const generateMarkupButtonNext = function (pageNum) {
  const markup = `
    <button data-goto="${
      pageNum + 1
    }"  class="btn--inline pagination__btn--next">
        <span>Page ${pageNum + 1}</span>
         ${ARROW_RIGHT} 
    </button>`;
  return markup;
};
