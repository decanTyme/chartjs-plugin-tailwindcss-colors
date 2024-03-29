/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "bar",
    data: {
      labels: [0, 1, 2, 3, 4, 5],
      datasets: [
        {
          data: [0, 5, 10, null, -10, -5],
        },
        {
          data: [10, 2, 3, null, 10, 5],
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
