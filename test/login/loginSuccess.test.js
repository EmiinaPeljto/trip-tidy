require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const { performLogin } = require("../utils/auth-utils");
require("chromedriver");

describe("Login page", function () {
  this.timeout(90000);

  let driver;

  before(async () => {
    const options = new chrome.Options().addArguments(
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-logging",
      "--log-level=3",
      "--disable-gpu",
      "--disable-software-rasterizer"
    );
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("logs in and has access to the profile page", async () => {
    await driver.get("https://trip-tidy.vercel.app/");
    await driver.manage().window().maximize();
    await driver.sleep(3000);

    // Use the login function from utils
    const loginSuccess = await performLogin(
      driver,
      process.env.EMAIL,
      process.env.PASSWORD
    );
    expect(loginSuccess).to.be.true;

    await driver.sleep(3000);

    await driver
      .findElement(
        By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/div/button")
      )
      .click();

    await driver.sleep(5000);

    await driver.findElement(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/div/div/a")).click();
    await driver.sleep(5000);

    // Assert that the user is on the profile page
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal("https://trip-tidy.vercel.app/profile");
  });
});
