import "dotenv/config";

// Original scrapper which wrote , works normally on my localnetwork
// But when i switch IP's , google throws in a captcha on the login screen which makes this apporach a failure
// and apprently theres this bug in X which is not letting me create an Account , always says "OOPs an error occured , please try again"
// Hence went with the cookie approach , still kept this function though

async function scrapper() {
  let options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--proxy-server=socks5://127.0.0.1:9050");
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--disable-infobars");
  options.addArguments(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/116.0.0.0 Safari/537.36"
  );

  console.log("Launching Chrome in headless mode...");

  // Open Chrome
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
        By.xpath("//*[contains(text(),'Sign up with Google')]")
      ),
      10000
    );
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

    console.log("[STEP] Waiting for 'Show more' button...");
    const showMore = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div/div[5]/section/div/div/div[7]/div/a/div/span`
        )
      ),
      10000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", showMore);
    await driver.executeScript("arguments[0].click();", showMore);
    console.log("[ACTION] Clicked 'Show more'");

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
  } finally {
    console.log("Closing browser...");
    await driver.quit();
  }
}
