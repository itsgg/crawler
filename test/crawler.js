const expect = require("chai").expect;
const stdout = require("test-console").stdout;

const crawler = require("../crawler");

describe("Crawler", () => {
  describe("#getHostname()", () => {
    it("should return correct hostname", () => {
      expect(crawler.getHostname("https://itsgg.com/")).to.equal("itsgg.com");
    });

    it("should throw exception for invalid url", () => {
      expect(() => crawler.getHostname("xxx")).to.throw();
    });
  });

  describe("#extractLinks()", () => {
    it("should return correct links", () => {
      const text = `<html>
          <body>
            <a href="https://itsgg.com/">itsgg.com</a>
            <a href="https://itsgg.com/about">about</a>
            <a href="./contact">contact</a>
            <a href="https://google.com/">google.com</a>
          </body>
        </html>`;
      expect(crawler.extractLinks("https://itsgg.com", text)).to.deep.equal([
        "https://itsgg.com",
        "https://itsgg.com/about",
        "https://itsgg.com/contact",
      ]);
    });
  });

  describe("#crawl()", () => {
    it("should recursively print links", async () => {
      const output = await stdout.inspectAsync(async () => {
        await crawler.crawl("https://itsgg.com", 4);
      });
      console.log(output);
      expect(output).to.deep.equal([
        "https://itsgg.com\n",
        "https://itsgg.com/about\n",
        "https://itsgg.com/site/news/2022/01/29/genesis.html\n",
      ]);
    });
  });
});
