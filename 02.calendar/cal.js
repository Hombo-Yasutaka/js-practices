import { createRequire } from "module";
import { cdate } from "cdate";

const require = createRequire(import.meta.url);
const argv = require("minimist")(process.argv.slice(2));
const target_ym = cdate()
  .set("year", argv["y"])
  .set("month", argv["m"] - 1);

console.log(target_ym.format("   MMMM YYYY"));
console.log("Su Mo Tu We Th Fr Sa");

const start = target_ym.startOf("month");
const end = target_ym.endOf("month");

for (let day = start; day <= end; ) {
  let dayOfWeek = day.format("d");
  let outputDay = day.format("D").padStart(2, " ");
  if (day === start) {
    process.stdout.write(" ".repeat(3 * Number(dayOfWeek)));
  }
  process.stdout.write(outputDay);
  if (dayOfWeek === "6") {
    console.log();
  } else {
    process.stdout.write(" ");
  }
  if (day.format("D") === end.format("D")) {
    console.log();
  }
  day = day.next("day");
}
