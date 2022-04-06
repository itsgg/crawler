const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");

const visited = new Set();

const getHostname = (link) => {
  const { hostname } = new URL(link);
  return hostname;
};

const extractLinks = (link, text) => {
  let $ = cheerio.load(text);
  return [
    ...new Set(
      $("a")
        .map((_, a) => url.resolve(link, $(a).attr("href")))
        .toArray()
        .filter((currentLink) => getHostname(link) === getHostname(currentLink))
    ),
  ];
};

const queue = (concurrency = 1) => {
  let running = 0;
  const tasks = [];

  return {
    enqueue: async (task, ...params) => {
      tasks.push({ task, params });
      if (running >= concurrency) {
        return;
      }

      ++running;
      while (tasks.length) {
        const { task, params } = tasks.shift();
        await task(...params);
      }

      --running;
    },
  };
};

const crawlTask = async (link) => {
  await crawl(link);
};

const crawl = async (link, workers) => {
  if (visited.has(link)) {
    return;
  }

  visited.add(link);
  console.log(link);

  try {
    const response = await axios.get(link);
    const links = extractLinks(link, response.data);
    links.forEach((link) => queue().enqueue(crawlTask, link));
  } catch (_error) {
    console.error(`Failed parsing ${link}`);
  }
  const q = queue(workers);
  q.enqueue(crawlTask, link);
};

module.exports = {
  getHostname,
  extractLinks,
  crawl,
};
