import { RES_PER_PAGE } from "./config.js";
import * as dashboard from "./views/dashboardView.js";
import { generateOrdersMarkup } from "./views/ordersView.js";
import * as charts from "./views/chartView.js";
import * as btnsPagination from "./views/paginationView.js";
import { generateUsersMarkup } from "./views/usersView.js";
import { generateProductMarkup } from "./views/productsView.js";
import * as helpers from "./helpers.js";
// import dataUrl from "url:../../data.txt";

//////// Declarations ///////////////////
const navBar = document.querySelector(".side__nav--list");
const navLink = document.querySelectorAll(".side__nav--item");
const btnToggle = document.querySelector(".btn__toggle");
const btnContainer = document.querySelector(".btn__mode");
const sections = document.querySelectorAll(".section__container");
const secHeadings = document.querySelectorAll(".section__heading");
const orderWrapper = document.querySelector(".orders__wrapper");
const productWrapper = document.querySelector(".products__wrapper");
const userWrapper = document.querySelector(".users__wrapper");
const moduleUserCont = document.querySelector(".user__list--container");
const moduleProdCont = document.querySelector(".products__list--container");
const moduleOrdersCont = document.querySelector(".orders__list--container");
const paginationUsers = document.querySelector(".pagination__users");
const paginationProducts = document.querySelector(".pagination__products");
const paginationOrders = document.querySelector(".pagination__orders");

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
    document.body.scrollIntoView({ behavior: "smooth" });
  }
});

////////////// Day/Night Mode toggle button //////////////

btnToggle.addEventListener("click", function (event) {
  if (event.target.dataset.status === "off") {
    event.target.dataset.status = "on";
    event.target.style.transform = "translateX(125%)";
    btnContainer.style.backgroundColor = "#6EDC5F";
    // secHeadings.forEach((hdr) => (hdr.style.color = "#84b8b1"));
    document.body.style.backgroundColor = "#ddd";
  } else if (event.target.dataset.status === "on") {
    event.target.dataset.status = "off";
    event.target.style.transform = "";
    btnContainer.style.backgroundColor = "#DDDDDD";
    document.body.style.backgroundColor = "#171821";
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
  try {
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

    ///////// Get most sold products data/////////////
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

    /////// Get sales data across 12 months///////

    // An array of order ids & order months
    const ordersList = [...orders]
      .map((order) => [order.id, new Date(order.created_at).getMonth()])
      .sort((a, b) => a[0] - b[0]);

    // An array of product order ids & order quantities
    const amountPerOrderID = [...state.info.orderProduct]
      .map((prod) => [prod.order_id, prod.qty])
      .sort((a, b) => a[0] - b[0]);

    // function to sum total quantity of orders with same ids
    const getTotalPerID = function () {
      const idValueSums = {};
      for (let i = 0; i < amountPerOrderID.length; i++) {
        if (!idValueSums.hasOwnProperty(amountPerOrderID[i][0])) {
          idValueSums[amountPerOrderID[i][0]] = +amountPerOrderID[i][1];
        } else {
          idValueSums[amountPerOrderID[i][0]] += +amountPerOrderID[i][1];
        }
      }
      return idValueSums;
    };
    const totalPerID = getTotalPerID();

    // add total quanities quantities to [order, month] array
    for (let i = 0; i < ordersList.length; i++) {
      if (totalPerID.hasOwnProperty(ordersList[i][0])) {
        ordersList[i].push(totalPerID[ordersList[i][0]]);
      } else {
        ordersList[i].push(0);
      }
    }

    ordersList.sort((a, b) => a[1] - b[1]);

    const getTotalPerMonth = function () {
      const monthlyTotal = {};

      for (let i = 0; i < ordersList.length; i++) {
        if (!monthlyTotal.hasOwnProperty(String(ordersList[i][1]))) {
          monthlyTotal[String(ordersList[i][1])] = +ordersList[i][2];
        } else {
          monthlyTotal[String(ordersList[i][1])] += +ordersList[i][2];
        }
      }
      return Object.values(monthlyTotal);
    };
    const monthlyTotalSalesList = getTotalPerMonth();

    charts.renderMonthlySalesChart(monthlyTotalSalesList);

    ////////////// Orders Section ///////////////////

    const getProdInfo = [...state.info.products].map((prod) => [
      prod.id,
      prod.name,
      prod.price,
    ]);
    const getOrderInfo = [...state.info.orders].map((item) => [
      item.id,
      item.user_id,
    ]);

    const getUserInfo = [...state.info.users].map((user) => [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
    ]);

    const getProdOrders = [...state.info.orderProduct];

    const prodDetails = [];

    //check for matching product IDs, generate a new object an add product name & price
    for (const item of getProdInfo) {
      for (const prodOrder of getProdOrders) {
        if (item[0] === prodOrder.product_id) {
          const newItem = {
            ...prodOrder,
            productName: [item[1]],
            productPrice: item[2],
          };
          prodDetails.push(newItem);
        }
      }
    }

    const detailsOrdersProds = [];

    //check for matching order IDs, generate a new object with the user ID
    for (const item of getOrderInfo) {
      for (const details of prodDetails) {
        if (item[0] === details.order_id) {
          const newItem = {
            ...details,
            userID: item[1], // needs an array of items for all products user bought
          };
          detailsOrdersProds.push(newItem);
        }
      }
    }

    const completeUserOrder = [];

    //check for matching user IDs, generate a new object with the user's details along with product & order info
    for (const item of getUserInfo) {
      for (const info of detailsOrdersProds) {
        if (item[0] === info.userID) {
          const newItem = {
            ...info,
            firstName: item[1],
            lastName: item[2],
            email: item[3],
          };
          completeUserOrder.push(newItem);
        }
      }
    }

    // multiply product price by units, create a new property for total price
    const getTotalPerOrder = [...completeUserOrder].map((data) => {
      const newItem = {
        ...data,
        total: +data.productPrice.slice(1) * +data.qty,
      };
      return newItem;
    });

    // remove unecessary properties from complete ino object
    getTotalPerOrder.forEach((item) => {
      delete item.id;
      delete item.product_id;
      delete item.order_id;
      delete item.qty;
      delete item.productPrice;
    });

    // helper array to compare [id, productName, total] below
    const itemsToCompare = [...getTotalPerOrder].map((item) => [
      item.userID,
      ...item.productName,
      item.total,
    ]);

    // Loop over the objects sum the users total and create an array of items purchased
    for (const item of getTotalPerOrder) {
      for (const data of itemsToCompare) {
        if (data[0] === item.userID && data[1] !== item.productName[0]) {
          item.productName.push(data[1]);
          item.total += data[2];
        }
      }
    }

    // Removes all duplicate user data from the final data to be rendered
    const completeUserData = Array.from(
      new Set(getTotalPerOrder.map((a) => a.userID))
    ).map((id) => {
      return getTotalPerOrder.find((a) => a.userID === id);
    });

    state.fullData = completeUserData;

    /////////////// Total Users, Products & Orders Rendering ///////////////////////

    const initialStateUsersProds = () => {
      // Users module initial
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

      //Products module initial
      moduleProdCont.insertAdjacentHTML(
        "beforeend",
        helpers
          .getResultsPerPageProducts(1, state)
          .map((product) => generateProductMarkup(product))
          .join("")
      );

      paginationProducts.insertAdjacentHTML(
        "afterbegin",
        btnsPagination.generateButtonMarkup(state, state.fullData)
      );

      // Orders module initial

      moduleOrdersCont.insertAdjacentHTML(
        "beforeend",
        helpers
          .getResultsPerPageOrders(1, state)
          .map((order) => generateOrdersMarkup(order, order.productName))
          .join("")
      );

      paginationOrders.insertAdjacentHTML(
        "afterbegin",
        btnsPagination.generateButtonMarkupOrders(state, state.fullData)
      );
    };
    initialStateUsersProds();

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

    paginationOrders.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      state.loaded.page = goToPage;
      moduleOrdersCont.innerHTML = "";
      paginationOrders.innerHTML = "";

      paginationOrders.insertAdjacentHTML(
        "afterbegin",
        btnsPagination.generateButtonMarkupOrders(state, state.fullData)
      );

      moduleOrdersCont.insertAdjacentHTML(
        "beforeend",
        helpers
          .getResultsPerPageOrders(state.loaded.page, state)
          .map((order) => generateOrdersMarkup(order, order.productName))
          .join("")
      );
    });
  } catch (err) {
    console.log(err);
  }
};
init();
