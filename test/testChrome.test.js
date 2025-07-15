const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

(async () => {
  const options = new chrome.Options()
    .addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    console.log("✅ Chrome launched");
  } catch (err) {
    console.error("❌ Error launching Chrome:", err);
  } finally {
    if (driver) await driver.quit();
  }
})();