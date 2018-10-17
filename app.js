const fs = require("fs");
const plist = require("plist");

if (process.argv.length<3) {
    console.log("Please provide a cocos plist file!");
    process.exit();
}

const plistFilePath = process.argv[2];

if (!fs.existsSync(plistFilePath)) {
    console.log("Target plist: %s not exist!", plistFilePath);
    process.exit();
}

const parsedPlist = plist.parse(fs.readFileSync(plistFilePath, "utf8"));
// console.log(JSON.stringify(obj));
let exportJson = {};

exportJson["file"] = parsedPlist.metadata.textureFileName;
exportJson["frames"] = {};

for (let key in parsedPlist.frames) {
    let frame = parsedPlist.frames[key];

    let posSizeJson = frame.frame.replace(/\{/g, "[").replace(/\}/g, "]");
    let posSize = JSON.parse(posSizeJson);

    let offsetJson = frame.offset.replace(/\{/g, "[").replace(/\}/g, "]");
    let offset = JSON.parse(offsetJson);

    let ssizeJson = frame.sourceSize.replace(/\{/g, "[").replace(/\}/g, "]");
    let ssize = JSON.parse(ssizeJson);

    let entry = {};
    entry["x"] = posSize[0][0];
    entry["y"] = posSize[0][1];
    entry["w"] = posSize[1][0];
    entry["h"] = posSize[1][1];
    entry["offX"] = offset[0];
    entry["offY"] = offset[1];
    entry["sourceW"] = ssize[0];
    entry["sourceH"] = ssize[1];

    exportJson["frames"][key] = entry;
}

let exportString = JSON.stringify(exportJson, null, 2);
let exportFilePath = plistFilePath.replace(".plist", ".json");

fs.writeFileSync(exportFilePath, exportString, "utf8");

console.log("Egret JSON file written to: %s.", exportFilePath);
