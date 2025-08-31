import { Builder, until, Key, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import "dotenv/config";
// import { newTorIdentity } from "./util.js";

export async function scrapperADV(loginCookie) {
  let options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  // options.addArguments("--proxy-server=socks5://127.0.0.1:9050"); use this if using TOR
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--disable-infobars");
  options.addArguments(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/116.0.0.0 Safari/537.36"
  );
  options.addArguments("--proxy-server=http://us-ca.proxymesh.com:31280");

  console.log("Launching Chrome in headless mode...");

  // Open Chrome
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    //if using TOR
    // await newTorIdentity();
    // console.log("New Tor IP requested");

    console.log("[STEP] Opening X.com...");
    await driver.get("https://www.x.com");

    await driver.sleep(30000);

    const cookies = loginCookie;
    for (const cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }

    console.log("[ACTION] Cookies are applied");

    await driver.get("https://x.com/home");

    await driver.sleep(5000);

    console.log("[STEP] Waiting for 'Explore' button...");
    const exploreButton = await driver.wait(
      until.elementLocated(By.css('a[data-testid="AppTabBar_Explore_Link"]')),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      exploreButton
    );
    await driver.executeScript("arguments[0].click();", exploreButton);
    console.log("[ACTION] Clicked 'EXPLORE'");

    await driver.sleep(5000);

    console.log("[STEP] Waiting for 'Trending' tab...");
    const trendingPage = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div[1]/div[1]/div[2]/nav/div/div[2]/div/div[2]/a/div/div/span`
        )
      ),
      10000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      trendingPage
    );
    await driver.executeScript("arguments[0].click();", trendingPage);
    console.log("[ACTION] Clicked 'Trending' tab");

    await driver.sleep(500);

    console.log("[STEP] Collecting trends...");
    const trends = await driver.wait(
      until.elementsLocated(
        By.xpath('//*[@data-testid="trend"]/div/div[2]/span')
      ),
      10000
    );

    const allTrends = [];
    for (let t of trends) {
      const text = await t.getText();
      allTrends.push(text);
    }

    console.log("--------------------------------------------");
    console.log(allTrends);
    console.log("--------------------------------------------");

    await driver.get("https://api.ipify.org");
    const ip = await driver.findElement(By.tagName("body")).getText();
    console.log("Browser's Public IP:", ip);

    await driver.sleep(10000);
    console.log("Script finished successfully.");
    return { trends: allTrends, IPAddress: ip };
  } finally {
    console.log("Closing browser...");
    await driver.quit();
  }
}

export async function refreshCookie() {
  let options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--disable-infobars");
  options.addArguments(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/116.0.0.0 Safari/537.36"
  );

  console.log("Launching Chrome in headless mode...");

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    console.log("[STEP] Opening X.com...");
    await driver.get("https://www.x.com");

    console.log("[STEP] Waiting for 'Sign up with Google' button...");

    const loginButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[@role='button' and .//span[text()='Sign up with Google']]"
        )
      ),
      20000
    );

    await driver.wait(until.elementIsVisible(loginButton), 10000);
    await driver.wait(until.elementIsEnabled(loginButton), 10000);

    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      loginButton
    );
    await driver.executeScript("arguments[0].click();", loginButton);
    console.log("[ACTION] Clicked 'Sign up with Google'");

    // Save main window handle
    const mainWindow = await driver.getWindowHandle();

    console.log("[STEP] Waiting for Google popup...");
    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length > 1,
      10000
    );

    const windows = await driver.getAllWindowHandles();
    const popupWindow = windows.find((w) => w !== mainWindow);
    await driver.switchTo().window(popupWindow);
    console.log("[ACTION] Switched to Google login popup");

    await driver.sleep(3000);

    console.log("[STEP] Waiting for email input...");
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );

    await emailInput.sendKeys(process.env.X_EMAILADDRESS, Key.RETURN);
    console.log("[ACTION] Entered email");

    await driver.sleep(5000);

    console.log("[STEP] Waiting for password input...");
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      10000
    );
    await passwordInput.sendKeys(process.env.X_PASSWORD, Key.RETURN);
    console.log("[ACTION] Entered password");

    await driver.sleep(10000);

    await driver.switchTo().window(mainWindow);
    console.log("[ACTION] Switched back to main window");

    await driver.sleep(5000);

    //Handle optional username step
    try {
      const usernameInput = await driver.wait(
        until.elementLocated(By.name("text")),
        5000
      );

      console.log("[STEP] Username input detected...");
      await usernameInput.sendKeys(process.env.X_USERNAME, Key.RETURN);
      console.log("[ACTION] Entered username");

      await driver.sleep(5000);
    } catch (err) {
      console.log("[INFO] No username step, continuing...");
    }

    const cookies = await driver.manage().getCookies();

    console.log("[SUCCESS] Cookies saved ");
    return JSON.stringify(cookies, null, 2);
  } finally {
    console.log("CLOSING THE BROWSER");
    await driver.quit();
  }
}
