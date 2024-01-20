/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "radar",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [5, 10, 6, 8, 3],
        },
      ],
    },
    options: {
      scales: {
        r: { display: false },
      },
      plugins: { legend: false },
    },
  },
}
