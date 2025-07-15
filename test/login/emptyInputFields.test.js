const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
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
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("does not submit form when required fields are empty", async () => {
    await driver.get("https://trip-tidy.vercel.app/");
    await driver.manage().window().maximize();
    await driver.sleep(3000);

    await driver.wait(
      until.elementLocated(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/a")),
      10000
    );
    await driver.findElement(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/a")).click();
    await driver.sleep(5000);

    await driver.findElement(By.xpath("//*[@id='root']/div[2]/div/section/div/div/div/p/a")).click();
    await driver.sleep(3000);

    await driver.wait(until.elementLocated(By.id("usernameOrEmail")), 3000);

    // Leave email and password fields empty
    await driver.findElement(By.id("usernameOrEmail")).clear();
    await driver.sleep(500);
    await driver.findElement(By.id("password")).clear();
    await driver.sleep(500);

    // Save current URL before submit
    const urlBefore = await driver.getCurrentUrl();

    // Click the login button
    await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/section/div/div/div/form/button[1]")
    ).click();
    await driver.sleep(2000);

    // Get URL after submit
    const urlAfter = await driver.getCurrentUrl();

    // Assert that the URL did not change (form was not submitted)
    expect(urlAfter).to.equal(urlBefore);
  });
});