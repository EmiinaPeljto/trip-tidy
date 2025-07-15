require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const { performLogin } = require("../utils/auth-utils");
require("chromedriver");

describe("Generate Itinerary", function () {
  this.timeout(150000); // Increase timeout to account for all steps

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

  it("registered user successfully saves itinerary", async () => {
    // Visit app and login
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

    // Go to planner
    const plannerLink = await driver.wait(
      until.elementLocated(
        By.xpath("//a[contains(@href, '/create-itinerary')]")
      ),
      10000
    );
    await plannerLink.click();

    // Wait for and fill form
    await driver.wait(until.elementLocated(By.id("origin")), 10000);
    await driver.findElement(By.id("origin")).sendKeys("LON");
    await driver.findElement(By.id("destination")).sendKeys("PAR");

    // Pick dates
    const dateInput = await driver.findElement(By.id("date"));
    await dateInput.click();
    await driver.sleep(1500);

    const startDate = await driver.findElement(
      By.xpath(
        "//button[contains(@class,'rdrDay') and not(contains(@class,'rdrDayPassive')) and .='27']"
      )
    );
    await startDate.click();

    const endDate = await driver.findElement(
      By.xpath(
        "//button[contains(@class,'rdrDay') and not(contains(@class,'rdrDayPassive')) and .='30']"
      )
    );
    await endDate.click();

    // Set budget
    await driver.findElement(By.id("budget")).sendKeys("1500");

    // Click Next
    const nextBtn = await driver.findElement(
      By.xpath("//button[text()='Next']")
    );
    await nextBtn.click();

    // Choose Solo
    const soloBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/section/div/div[1]/button[1]")
      ),
      15000
    );
    await soloBtn.click();

    // Next to preferences
    const nextPrefBtn = await driver.findElement(
      By.xpath("//button[text()='Next']")
    );
    await nextPrefBtn.click();

    // Choose some preferences (e.g., nightlife)
    const prefBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/section/div/div[1]/button[4]")
      ),
      10000
    );
    await prefBtn.click();

    // Click next again
    const finalNext = await driver.findElement(
      By.xpath("//*[@id='root']/div[2]/div/section/div/div[2]/button[2]")
    );
    await finalNext.click();

    // Wait for itinerary builder to load
    const itineraryInput = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/div/main/section[1]/div/div/input")
      ),
      30000
    );

    // Set itinerary title
    await itineraryInput.clear();
    const itineraryTitle = "Paris Solo Trip";
    await itineraryInput.sendKeys(itineraryTitle);

    // Scroll to save and click
    await driver.executeScript(
      "window.scrollTo(0, document.body.scrollHeight);"
    );
    const saveBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/aside/aside/nav/ul[2]/li/button")
      ),
      10000
    );
    await saveBtn.click();

    // Wait for redirect to complete
    await driver.sleep(8000);
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

    // Verify title in profile page
    const savedTitleEl = await driver.wait(
      until.elementLocated(
        By.xpath("//*[@id='root']/div[2]/div/div/div[2]/div/div/div[4]/div/div[2]/h3")
      ),
      10000
    );
    const savedTitleText = await savedTitleEl.getText();
    expect(savedTitleText.trim()).to.equal("Paris Solo Trip");
  });
});
