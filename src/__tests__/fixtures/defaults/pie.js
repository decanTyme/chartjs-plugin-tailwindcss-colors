/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "pie",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [5, 10, 6, 8, 3],
        },
        {
          data: [7, 3, 9, 4, 6],
        },
      ],
    },
    options: {
      scales: {
        x: { display: false },
        y: { display: false },
      },
      plugins: { legend: false },
    },
  },
}
