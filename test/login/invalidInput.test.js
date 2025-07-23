const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
require("chromedriver");

describe("Login page", function () {
  this.timeout(90000); // Increase timeout to 90 seconds

  let driver;

  before(async () => {
    console.log("🚀 Launching Chrome...");
    try {
      const options = new chrome.Options().addArguments(
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-logging", // Disable logging
        "--log-level=3", // Only fatal errors (0=ALL, 3=FATAL)
        "--disable-gpu",
        "--disable-software-rasterizer"
      );

      // NO --headless here, so browser window will show

      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

      console.log("✅ Chrome launched.");
    } catch (e) {
      console.error("❌ Failed to launch Chrome:", e);
      throw e;
    }
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("shows error for invalid credentials", async () => {
    await driver.get("https://trip-tidy.vercel.app/");
    await driver.manage().window().maximize();
    await driver.sleep(3000);

    await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/a")
      ),
      10000
    );

    await driver
      .findElement(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/a"))
      .click();
    await driver.sleep(5000);

    await driver
      .findElement(
        By.xpath("//*[@id='root']/div[2]/div/section/div/div/div/p/a")
      )
      .click();
    await driver.sleep(3000);

    await driver.wait(until.elementLocated(By.id("usernameOrEmail")), 3000);

    await driver
      .findElement(By.id("usernameOrEmail"))
      .sendKeys("invalid-email");
    await driver.findElement(By.id("password")).sendKeys("invalid-password");
    await driver
      .findElement(
        By.xpath(
          "//*[@id='root']/div[2]/div/section/div/div/div/form/button[1]"
        )
      )
      .click();
    await driver.sleep(8000);

    const errorMessage = await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/section/div/div/div/form/p")
    );
    const errorText = await errorMessage.getText();

    expect(errorText.toLowerCase()).to.include("invalid");
  });
});
