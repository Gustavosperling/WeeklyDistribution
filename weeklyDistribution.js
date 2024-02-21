import { RE2JS } from 're2js';

const INPUT_VALIDATION_REGEX = RE2JS.compile("^([A-Za-z\\s]+,\\s*\\[((true|false)\\s*,\\s*)*(true|false){0,1}\\]\\n{0,1})+$");

class InvalidInputException extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidInputException";
  }
}

export { weeklyDistribution, InvalidInputException };

// Main function
function weeklyDistribution(string) {
  // Empty map for the weekly schedule
  const allNamesSet = new Set();
  const dayOfWeek = new Map([
    ["Monday", { count: 0, names: new Set() }],
    ["Tuesday", { count: 0, names: new Set() }],
    ["Wednesday", { count: 0, names: new Set() }],
    ["Thursday", { count: 0, names: new Set() }],
    ["Friday", { count: 0, names: new Set() }],
  ]);

  if (!INPUT_VALIDATION_REGEX.matches(string)) {
    throw new InvalidInputException(`Error: input did not match regex [${INPUT_VALIDATION_REGEX}]`);
  }

  loadWeeklyDataFromString(string, dayOfWeek, allNamesSet);

  // Sorting the map by the count number and extracting the 3 most voted days
  const sortedEntries = [...dayOfWeek.entries()].sort((a, b) => b[1].count - a[1].count);
  let completeReport = [];

  for (let entry of sortedEntries.slice(0, 3)) {
    completeReport.push(makeReportEntry(entry[0], entry[1].count, Array.from(entry[1].names), cannotGoNames(entry[0], dayOfWeek, allNamesSet)));
  }

  return {"completeReport": completeReport};
}

function makeReportEntry(day, numberCount, canGo, cannotGo) {
  return {"day": day, "numberCount": numberCount, "canGo": canGo, "cannotGo": cannotGo};
}

// Function to insert the day and get all the names that cannot go on that day
function cannotGoNames(day, dayOfWeekMap, allNamesSet) {
  let cannotGoArr = [];
  let canGoSet = dayOfWeekMap.get(day).names;

  for (let name of allNamesSet) {
    if (!canGoSet.has(name)) {
      cannotGoArr.push(name);
    }
  }

  return cannotGoArr;
}

// Function to convert raw string into names and arrays
function loadWeeklyDataFromString(string, dayOfWeekMap, allNamesSet) {
  let name = "";
  let availableDays = [];
  let stringToArr = string.trim().split("\n");

  for (let line of stringToArr) {
    name = line.split(",", 1);
    allNamesSet.add(name);
    availableDays = JSON.parse(line.substring(name[0].length + 1));
    // Call function to add each name and respective available days to the the map
    addPersonToWeeklySchedule(name, availableDays, dayOfWeekMap);
  }
}

// Function add the count and name for each day 
function addPersonToWeeklySchedule(name, weekArr, dayOfWeekMap) {
  if (weekArr.length === 0) {
    weekArr = [true, true, true, true, true];
  } 

  // Count the days that are "true"
  for (let i = 0; i < weekArr.length; i++) {
    if (weekArr[i]) {
      // Get the day acording to the index
      let day = getDayOfWeek(i);
      // Update the count of the day in the map and add the name to it
      let chosenDayOfWeek = dayOfWeekMap.get(day);
      chosenDayOfWeek.count++;
      chosenDayOfWeek.names.add(name);
    }
  }
}

// Function to translate indexes into days of the week
function getDayOfWeek(index) {
  switch (index) {
    case 0:
      return "Monday";
    case 1:
      return "Tuesday";
    case 2:
      return "Wednesday";
    case 3:
      return "Thursday";
    case 4:
      return "Friday";
    default:
      return "";
  }
}

// Function for printing the day count and names
function printWeeklyReport(map) {
  let output = "";

  map.forEach(
    (value, key) =>
      (output += `${key}: ${value.count}, [${Array.from(value.names)}]\n`)
  );
  console.log(output);
}
