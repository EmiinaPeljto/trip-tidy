require('dotenv').config();
const { Builder, By, until } = require("selenium-webdriver");

exports.performLogin = async (driver, email = process.env.EMAIL, password = process.env.PASSWORD) => {
     try {
    await driver.wait(until.elementLocated(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/a")), 10000);
    await driver.sleep(3000);

    // Click the signUp button
    await driver.findElement(By.xpath("//*[@id='root']/div[2]/nav/div/div/div[3]/a")).click();
    await driver.sleep(3000);

    // Click oon the logIn link
    await driver.findElement(By.xpath("//*[@id='root']/div[2]/div/section/div/div/div/p/a")).click();
    await driver.sleep(3000);

    // Wait for the email input field to be present
    await driver.wait(until.elementLocated(By.id("usernameOrEmail")), 10000);
    await driver.sleep(3000);

    // Enter email
    await driver.findElement(By.id("usernameOrEmail")).sendKeys(email);
    await driver.sleep(3000);

    // Enter password
    await driver.findElement(By.id("password")).sendKeys(password);
    await driver.sleep(3000);

    // Click the login button
    await driver.findElement(By.xpath("//*[@id='root']/div[2]/div/section/div/div/div/form/button[1]")).click();
    await driver.sleep(3000);

    // Wait for the homepage to load after login
    await driver.wait(until.urlIs("https://trip-tidy.vercel.app/"), 100000);
    await driver.sleep(3000);

    console.log("Login successful!");
    return true;
  } catch (err) {
    console.error("Login failed:", err);
    return false;
  }
}