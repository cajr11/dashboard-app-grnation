// Helper function to get results to be shown on each page

export const getResultsPerPage = function (page, currState) {
  currState.loaded.page = page;

  const start = (page - 1) * currState.loaded.resultsPerPage;
  const end = page * currState.loaded.resultsPerPage;
  return currState.info.users.sort((a, b) => a.id - b.id).slice(start, end);
};

export const getResultsPerPageProducts = function (page, currState) {
  currState.loaded.page = page;

  const start = (page - 1) * currState.loaded.resultsPerPage;
  const end = page * currState.loaded.resultsPerPage;
  return currState.info.products.sort((a, b) => a.id - b.id).slice(start, end);
};

export const getResultsPerPageOrders = function (page, currState) {
  currState.loaded.page = page;

  const start = (page - 1) * currState.loaded.resultsPerPage;
  const end = page * currState.loaded.resultsPerPage;
  return currState.fullData
    .sort((a, b) => a.userID - b.userID)
    .slice(start, end);
};
