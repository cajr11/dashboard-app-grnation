////////////////// Charts ///////////////////////

export const renderTopSoldProdChart = function (itemNames, qtySold) {
  /// Top 5 most sold products
  const ctx = document.getElementById("topSales");
  const myChart = new Chart(ctx, {
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
