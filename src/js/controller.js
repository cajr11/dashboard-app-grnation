//////// Naviation ///////////////////

const navBar = document.querySelector(".side__nav--list");
const navLink = document.querySelectorAll(".side__nav--item");
const sections = document.querySelectorAll(".section__container");

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

////////// Read JSON Data //////////////
const orderWrapper = document.querySelector(".orders__wrapper");
const productWrapper = document.querySelector(".products__wrapper");
const userWrapper = document.querySelector(".users__wrapper");
const state = {
  info: {},
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

const getData = async function () {
  const res = await fetch("data.txt");
  const data = await res.json();
  createInfoObject(data);
  console.log(state.info);

  // Sort latest orders to create mark up
  const orders = state.info.orders;
  const latestOrders = orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const newList = latestOrders
    .map((item) => generateLatestOrdersMarkup(item))
    .join("");
  orderWrapper.insertAdjacentHTML("beforeend", newList);

  // Sort latest products to create mark up
  const products = state.info.products;
  const latestProducts = products
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const newProdList = latestProducts
    .map((prod) => generateLatestProuctsMarkup(prod))
    .join("");
  productWrapper.insertAdjacentHTML("beforeend", newProdList);

  // Sort latest users to create mark up
  const users = state.info.users;
  const latestUsers = users
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  console.log(latestUsers);
  const newUserList = latestUsers
    .map((pers) => generateLatestUsersMarkup(pers))
    .join("");
  userWrapper.insertAdjacentHTML("beforeend", newUserList);
};
getData();

//////////// Generate markup for latest tables ////////

const generateLatestOrdersMarkup = function (order) {
  const markup = `
            <div class="order__info">
                <ul class="order__info--list">
                    <li>${order.id}</li>
                    <li>${order.user_id}</li>
                    <li>${order.created_at}</li>
                </ul>
            </div>
`;
  return markup;
};

const generateLatestProuctsMarkup = function (product) {
  const markup = `
        <div class="product__info">
            <ul class="product__info--list">
                <li>${product.id}</li>
                <li>${product.name}</li>
                <li>${product.price}</li>
                <li>${product.created_at}</li>
            </ul>
        </div>
    `;
  return markup;
};

const generateLatestUsersMarkup = function (user) {
  const markup = `
            <div class="user__info">
                <ul class="user__info--list">
                    <li>${user.id}</li>
                    <li>${user.firstName}</li>
                    <li>${user.lastName}</li>
                    <li>${user.initials}</li>
                    <li>${user.email}</li>
                    <li>${user.created_at}</li>
                </ul>
            </div>
      `;
  return markup;
};

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Orange"],
    datasets: [
      {
        label: "5 Most Sold Products",
        data: [12, 19, 3, 5, 7],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
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
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Top 5 Most Sold Products",
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
        label: "My First Dataset",
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
