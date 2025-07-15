require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
require("chromedriver");

describe("Generate Itinerary", function () {
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

  it("unregister user cannot save itinerary", async () => {
    await driver.get("https://trip-tidy.vercel.app/");
    await driver.manage().window().maximize();
    await driver.sleep(2000);

    // Go to itinerary/planner page
    const plannerLink = await driver.wait(
      until.elementLocated(
        By.xpath("//a[contains(@href, '/create-itinerary')]")
      ),
      10000
    );
    await plannerLink.click();

    // Wait for form to load
    await driver.wait(until.elementLocated(By.id("origin")), 10000);

    // Fill form
    await driver.findElement(By.id("origin")).sendKeys("LON");
    await driver.sleep(500);
    await driver.findElement(By.id("destination")).sendKeys("PAR");
    await driver.sleep(500);

    // Select date range
    const dateInput = await driver.findElement(By.id("date"));
    await dateInput.click();
    await driver.sleep(1500);

    const startDate = await driver.findElement(
      By.xpath(
        "//button[contains(@class,'rdrDay') and not(contains(@class,'rdrDayPassive')) and .='27']"
      )
    );
    await startDate.click();
    await driver.sleep(500);

    const endDate = await driver.findElement(
      By.xpath(
        "//button[contains(@class,'rdrDay') and not(contains(@class,'rdrDayPassive')) and .='30']"
      )
    );
    await endDate.click();
    await driver.sleep(500);

    // Enter budget
    await driver.findElement(By.id("budget")).sendKeys("1500");

    // Click 'Next' to go to trip type step
    const nextBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Next']")),
      10000
    );
    await nextBtn.click();
    await driver.sleep(2000);

    // Select 'Solo' trip type
    const soloBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/section/div/div[1]/button[1]")
      ),
      15000
    );
    await soloBtn.click();
    await driver.sleep(2000);

    // Click Next again to go to preferences
    const nextStepBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Next')]")),
      10000
    );
    await nextStepBtn.click();
    await driver.sleep(10000);

    await driver
      .wait(
        until.elementLocated(
          By.xpath("//*[@id='root']/div[2]/div/section/div/div[1]/button[4]")
        ),
        10000
      )
      .click();
    await driver.sleep(2000);

    await driver
      .wait(
        until.elementLocated(
          By.xpath("//*[@id='root']/div[2]/div/section/div/div[2]/button[2]")
        ),
        10000
      )
      .click();
    await driver.sleep(30000);

    await driver.executeScript(
      "window.scrollTo(0, document.body.scrollHeight);"
    );

    await driver
      .findElement(
        By.xpath("//*[@id='root']/div[2]/div/aside/aside/nav/ul[2]/li/button")
      )
      .click();
    await driver.sleep(5000);

    // Wait for the app to attempt saving / redirect to login
    await driver.wait(until.urlContains("/login"), 15000);

    // Assert that we're on the login page
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/login");
  });
});
