
const { seed } = require("../test/drivers/video")();

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

(async () => {
  let i = 0;
  while (i < 10) {
    await seed(100);
    await sleep(1000);
    i++;
  }
})();
