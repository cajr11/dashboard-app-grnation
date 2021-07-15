import { RES_PER_PAGE } from "./config.js";
import * as dashboard from "./views/dashboardView.js";
import * as charts from "./views/chartView.js";
import * as btnsPagination from "./views/paginationView.js";
import { generateUsersMarkup } from "./views/usersView.js";
import { generateProductMarkup } from "./views/productsView.js";
import * as helpers from "./helpers.js";

//////// Declarations ///////////////////
const navBar = document.querySelector(".side__nav--list");
const navLink = document.querySelectorAll(".side__nav--item");
const sections = document.querySelectorAll(".section__container");
const orderWrapper = document.querySelector(".orders__wrapper");
const productWrapper = document.querySelector(".products__wrapper");
const userWrapper = document.querySelector(".users__wrapper");
const moduleUserCont = document.querySelector(".user__list--container");
const moduleProdCont = document.querySelector(".products__list--container");
const paginationUsers = document.querySelector(".pagination__users");
const paginationProducts = document.querySelector(".pagination__products");

//////////// Navigation //////////////////////////
navBar.addEventListener("click", function (event) {
  if (event.target.classList.contains("side__nav--item")) {
    navLink.forEach((nav) => nav.classList.remove("active"));
    event.target.classList.add("active");
    sections.forEach((sect) => {
      if (sect.classList.contains("hidden")) {
        return;
      } else {
        sect.classList.add("hidden");
      }
    });
    document
      .querySelector(event.target.dataset.link)
      .classList.remove("hidden");
  }
});

////////// App State Object //////////////

const state = {
  info: {},
  loaded: {
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

const createInfoObject = function (data) {
  const { ...info } = data;
  return (state.info = {
    orders: info.Orders,
    users: info.Users,
    products: info.Products,
    orderProduct: info.Order_Product,
  });
};

/////// App ////////////////////

// fetch data, parse & render it
const init = async function () {
  const res = await fetch("data.txt");
  const data = await res.json();
  createInfoObject(data);
  console.log(state.info);

  // Sort latest orders then render mark up
  const orders = state.info.orders;
  const latestOrders = orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const newList = latestOrders
    .map((item) => dashboard.generateLatestOrdersMarkup(item))
    .join("");
  orderWrapper.insertAdjacentHTML("beforeend", newList);

  // Sort latest products then render mark up
  const products = state.info.products;
  const latestProducts = products
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const newProdList = latestProducts
    .map((prod) => dashboard.generateLatestProuctsMarkup(prod))
    .join("");
  productWrapper.insertAdjacentHTML("beforeend", newProdList);

  // Sort latest users then render mark up
  const usersInfo = state.info.users;
  const latestUsers = usersInfo
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const newUserList = latestUsers
    .map((pers) => dashboard.generateLatestUsersMarkup(pers))
    .join("");
  userWrapper.insertAdjacentHTML("beforeend", newUserList);

  // Get most sold products data
  const topSoldProds = state.info.orderProduct
    .sort((a, b) => parseInt(b.qty) - parseInt(a.qty))
    .slice(0, 5)
    .sort((a, b) => parseInt(a.product_id) - parseInt(b.product_id));

  const topSoldQtys = topSoldProds.map((item) => item.qty);

  const topProdIDs = topSoldProds.map((item) => item.product_id);
  const topSoldProdNames = products
    .filter((prod) => topProdIDs.includes(prod.id))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
    .map((item) => item.name);

  charts.renderTopSoldProdChart(topSoldProdNames, topSoldQtys);

  /////////////// Total Users & Products ///////////////////////

  const initialAppState = () => {
    moduleUserCont.insertAdjacentHTML(
      "beforeend",
      helpers
        .getResultsPerPage(1, state)
        .map((user) => generateUsersMarkup(user))
        .join("")
    );

    paginationUsers.insertAdjacentHTML(
      "afterbegin",
      btnsPagination.generateButtonMarkup(state, state.info.users)
    );

    moduleProdCont.insertAdjacentHTML(
      "beforeend",
      helpers
        .getResultsPerPageProducts(1, state)
        .map((product) => generateProductMarkup(product))
        .join("")
    );

    paginationProducts.insertAdjacentHTML(
      "afterbegin",
      btnsPagination.generateButtonMarkup(state, state.info.products)
    );
  };
  initialAppState();

  // Event Listeners for Pagination buttons
  paginationUsers.addEventListener("click", function (e) {
    e.preventDefault();
    const btn = e.target.closest(".btn--inline");
    if (!btn) return;

    const goToPage = +btn.dataset.goto;
    state.loaded.page = goToPage;
    moduleUserCont.innerHTML = "";
    paginationUsers.innerHTML = "";

    paginationUsers.insertAdjacentHTML(
      "afterbegin",
      btnsPagination.generateButtonMarkup(state, state.info.users)
    );

    moduleUserCont.insertAdjacentHTML(
      "beforeend",
      helpers
        .getResultsPerPage(state.loaded.page, state)
        .map((user) => generateUsersMarkup(user))
        .join("")
    );
  });

  paginationProducts.addEventListener("click", function (e) {
    e.preventDefault();
    const btn = e.target.closest(".btn--inline");
    if (!btn) return;

    const goToPage = +btn.dataset.goto;
    state.loaded.page = goToPage;
    moduleProdCont.innerHTML = "";
    paginationProducts.innerHTML = "";

    paginationProducts.insertAdjacentHTML(
      "afterbegin",
      btnsPagination.generateButtonMarkup(state, state.info.Products)
    );

    moduleProdCont.insertAdjacentHTML(
      "beforeend",
      helpers
        .getResultsPerPageProducts(state.loaded.page, state)
        .map((product) => generateProductMarkup(product))
        .join("")
    );
  });
};
init();

//////////// 12 months sale data/////////////////////

const ltx = document.getElementById("chartNew");
const othrChart = new Chart(ltx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40, 32, 90, 60, 22, 95],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Sales",
        color: "#f3f3f3",
        font: {
          weight: "200",
          family: "Roboto",
        },
      },
      legend: {
        display: false,
      },
    },
  },
});
