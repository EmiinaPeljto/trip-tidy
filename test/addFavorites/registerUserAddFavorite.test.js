require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const { performLogin } = require("../utils/auth-utils");
require("chromedriver");

describe("Add favorite", function () {
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

  it("register user add to favorites", async () => {
    await driver.get("https://trip-tidy.vercel.app/");
    await driver.manage().window().maximize();
    await driver.sleep(2000);

    const loginSuccess = await performLogin(
      driver,
      process.env.EMAIL,
      process.env.PASSWORD
    );
    expect(loginSuccess).to.be.true;
    await driver.sleep(3000);

    await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/nav/div/div/div[2]/a[3]")
      ),
      5000
    );

    await driver
      .findElement(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[2]/a[3]"))
      .click();
    await driver.sleep(5000);

    const card = await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/main/div/div[2]/div[1]/div[2]")
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", card);
    await driver.sleep(2000);

    const viewButton = await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/main/div/div[2]/div[1]/div[2]/a")
    );
    await viewButton.click();
    await driver.sleep(5000);

    await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/div/section/div/div/button")
      ),
      10000
    );
    const addToFavBtn = await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/div/section/div/div/button")
    );
    await addToFavBtn.click();
    await driver.sleep(3000);

    const title = await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/div/section/div/div/h1")
    );
    const titleText = await title.getText();
    await driver.sleep(2000);

    await driver.executeScript("window.scrollTo(0, 0);");

    // Open user menu
    const userMenuBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/div/button")
      ),
      10000
    );
    await userMenuBtn.click();

    // Click profile
    const profileLink = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/div/div/a")
      ),
      10000
    );
    await profileLink.click();

    await driver.sleep(5000);

    const favSec = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/div/div[1]/div[3]/button[2]")
      ),
      10000
    );
    favSec.click();
    await driver.sleep(5000);

    // Verify title in profile page
    const savedTitleEl = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//*[@id='root']/div[2]/div/div/div[2]/div/div/div[1]/div/div[2]/h3"
        )
      ),
      10000
    );
    const savedTitleText = await savedTitleEl.getText();
    expect(savedTitleText.trim()).to.equal(titleText.trim());
  });
});
