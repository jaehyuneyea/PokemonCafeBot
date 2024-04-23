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

async function run() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get("https://reserve.pokemon-cafe.jp/reserve/step1");

    ///////////////////////////////////////////////////
    ///////////////// CALENDAR PAGE ///////////////////
    ///////////////////////////////////////////////////

    let available = [];
    let date;
    await driver
      .wait(until.elementLocated(By.xpath("//select[@name='guest']")), 1000)
      .then(async () => {
        const dayInterval = setInterval(async () => {
          console.log("checking for available dates");

          await driver.findElement(By.xpath("//select[@name='guest']")).click();
          await driver
            .findElement(By.xpath(`//option[@value=${NUM_PEOPLE}]`))
            .click();
          console.log("selected nnum people");
          await driver
            .wait(
              until.elementLocated(
                By.xpath(`//*[contains(text(), "次の月を見る")]`)
              ),
              1000
            )
            .click()
            .then(async () => {
              console.log("found next month");
              available = await driver.findElements(
                By.className("calendar-day-cell")
              );
              console.log(available.length);
              if (available.length !== 0) {
                clearInterval(dayInterval);
              } else {
                console.log("no availability found! Refreshing");
                driver.navigate().refresh();
              }
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
                console.log(text);
                console.log(date);
              }
              await driver
                .findElement(By.xpath(`//*[contains(text(), ${date})]`))
                .click();
              await driver.findElement(By.id("submit_button")).click();

              ///////////////////////////////////////////////////
              ///////////////// TIME SELECT PAGE ////////////////
              ///////////////////////////////////////////////////
              let openTimes: WebElement[] =[];
              await driver.wait(
                until.elementLocated(By.className("time-cell")),
                1000
              );
              // priority for seating A
              let j = 0;
              const timeInterval = setInterval(async () => {
                console.log("checking for available times");
                await driver
                  .findElements(By.xpath('//a[@class="level post-link"]'))
                  .then(async (times) => {
                    openTimes = times;
                    console.log(times);
                    if (openTimes.length !== 0) {
                      clearInterval(timeInterval);
                    } else {
                      console.log("no availability found! Refreshing");
                      driver.navigate().refresh();
                    }
                    console.log(openTimes.length);
                  });
              }, 1000);
              while (j < openTimes.length && c) {
                const text = await openTimes[j].getText();
                if (text.includes("A")) {
                  openTimes.push(openTimes[j]);
                  c = false;
                } else if (text.includes("C")) {
                  openTimes.push(openTimes[j]);
                  c = false;
                } else if (text.includes("B")) {
                  openTimes.push(openTimes[j]);
                  c = false;
                }
                console.log(text);
                j++;
              }
              await openTimes[0].click().then(async () => {
                ///////////////////////////////////////////////////
                ///////////////// INPUT PAGE //////////////////////
                ///////////////////////////////////////////////////

                await driver
                  .wait(until.elementLocated(By.id("name")), 1000)
                  .then(async () => {
                    await driver
                      .findElement(By.id("name"))
                      .sendKeys("Jae Hyune Yea");
                    await driver
                      .findElement(By.id("name_kana"))
                      .sendKeys("Jae Hyune Yea");
                    await driver
                      .findElement(By.id("phone_number"))
                      .sendKeys("7782313154");
                    await driver
                      .findElement(By.id("email"))
                      .sendKeys("jaehyune.yea@gmail.com");
                    await driver
                      .findElement(By.xpath("//input[@name='commit']"))
                      .click();

                    /////////////////////////////////////////////////
                    ///////////////// CONFIRM PAGE //////////////////
                    /////////////////////////////////////////////////

                    // if the list is empty, refresh
                  });
              });
            });
        }, 10000);
      });
  } catch {
    console.log("Error");
  } finally {
    // await driver.quit();
  }
}
run();
