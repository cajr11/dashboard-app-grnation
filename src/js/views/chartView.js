////////////////// Charts ///////////////////////

/// Top 5 most sold products
export const renderTopSoldProdChart = function (itemNames, qtySold) {
  const barChart = document.getElementById("topSales");
  const myChart = new Chart(barChart, {
    type: "bar",
    data: {
      labels: itemNames,
      datasets: [
        {
          label: "5 Most Sold Products",
          data: qtySold,
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
};

/// Monthly sales chart
export const renderMonthlySalesChart = function (salesData) {
  const lineChart = document.getElementById("chartNew");
  const monthlySaleData = new Chart(lineChart, {
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
          data: salesData,
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
};
