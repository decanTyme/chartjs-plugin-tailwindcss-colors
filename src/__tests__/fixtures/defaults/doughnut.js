/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "doughnut",
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          data: [15, 7, 20, 9, 12],
        },
        {
          data: [5, 10, 6, 8, 3],
        },
      ],
    },
  },
}
