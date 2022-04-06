const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const crawler = require("./crawler");

const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide.",
  },
  {
    name: "url",
    type: String,
    defaultOption: true,
    description: "The URL to crawl.",
  },
  {
    name: "workers",
    type: Number,
    alias: "n",
    description: "The number of workers to use.",
  },
];

const options = commandLineArgs(optionDefinitions);

if (options.help || !options.url) {
  const usage = commandLineUsage([
    {
      header: "Crawl",
      content: "Crawl a website and output the results to stdout.",
    },
    {
      header: "Options",
      optionList: optionDefinitions,
    },
  ]);
  console.log(usage);
  process.exit(0);
}

const url = options.url;
const workers = options.workers || 1;

crawler.crawl(url, workers);
