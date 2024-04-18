import { Builder, Browser, By, until, WebElement } from "selenium-webdriver";

// 1. Create a new Builder instance
// 2. Connect to the browser
// 3. Connect to pokemon web
// 4. Iterate every 10 minutes?
// 5. check for May 15 - 17 spots
// 6. If spots are available, take spot
// 6b. Priority for seating A
// Return if not available
// 7. Fill input
// 8. Await input on access code?
const NUM_PEOPLE = 3;
const ENVIRONMENT = "DEV" : "PROD";

async function run() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get("https://reserve.pokemon-cafe.jp/reserve/step1");
    // calendar page
    await driver.wait(
      until.elementLocated(By.xpath("//select[@name='guest']")),
      1000
    );
    await driver.findElement(By.xpath("//select[@name='guest']")).click();
    await driver
      .findElement(By.xpath(`//option[@value=${NUM_PEOPLE}]`))
      .click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), "次の月を見る")]`)),
      1000
    );
    let available = [];
    let date;
    // const dayInterval = setInterval(async () => {
    //   await driver
    //   .findElement(By.xpath(`//*[contains(text(), "次の月を見る")]`))
    //   .click();

    // available = await driver.findElements(
    //   By.xpath('//li[@class="calendar-day-cell available"]') // TODO: Change to available
    // );

    // if (available.length !== 0) {
    //   clearInterval(dayInterval);
    //   console.log("refreshed");
    // }
    // }, 1000);
    await driver
      .findElement(By.xpath(`//*[contains(text(), "次の月を見る")]`))
      .click();

    // while (available.length === 0) {

    available = await driver.findElements(
      By.xpath('//li[@class="calendar-day-cell not-available"]') // TODO: Change to available
    );

    // if (available.length === 0) {
    //   driver.navigate().refresh();
    //   console.log("refreshed");
    // }
    // }
    let i = 0;
    let c = true;
    while (i < available.length && c) {
      const text = await available[i].getText();
      if (text.includes("15")) {
        date = 15;
        c = false;
      } else if (text.includes("16")) {
        date = 16;
        c = false;
      } else if (text.includes("17")) {
        date = 17;
        c = false;
      }
      i++;
    }
    await driver
      .findElement(By.xpath(`//*[contains(text(), ${date})]`))
      .click();
    await driver.findElement(By.id("submit_button")).click();

    // time select page
    await driver.wait(until.elementLocated(By.className("time-cell")), 1000);
    let openTimes: WebElement[] = await driver.findElements(
      By.xpath('//div[@class="level full"]')
    ); // TODO: Change to available after finding the value

    // priority for seating A
    let j = 0;
    if (openTimes.length === 0) {
      driver.navigate().refresh();
    }
    while (j < openTimes.length && c) {
      const text = await openTimes[j].getText();
      if (text.includes("A")) {
        await openTimes[j].click();
        c = false;
      } else if (text.includes("C")) {
        await openTimes[j].click();
        c = false;
      } else if (text.includes("B")) {
        await openTimes[j].click();
        c = false;
      }
      console.log(text);
      j++;
    }

    // if the list is empty, refresh
  } catch {
    console.log("Error");
  } finally {
    // await driver.quit();
  }
}
run();
