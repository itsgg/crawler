let expect = require("chai").expect;

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
        "https://itsgg.com/",
        "https://itsgg.com/about",
        "https://itsgg.com/contact",
      ]);
    });
  });
});
