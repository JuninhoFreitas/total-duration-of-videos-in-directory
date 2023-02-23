const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const VIDEO_EXTENSIONS = [".mp4", ".avi", ".mkv", ".mov"]; // Add more extensions as needed

function getTotalVideoTime(directoryPath) {
  let totalSeconds = 0;
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isDirectory()) {
      totalSeconds += getTotalVideoTime(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (VIDEO_EXTENSIONS.includes(ext)) {
        const ffprobeOutput = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
        const durationString = ffprobeOutput.toString().trim();
        const durationSeconds = parseFloat(durationString);
        if (!isNaN(durationSeconds)) {
        console.log('Video:', file, '-' , (durationSeconds/60).toFixed(0),'min')
          totalSeconds += durationSeconds;
        }
      }
    }
  });
  return totalSeconds;
}

const directoryPath = "./";
const totalSeconds = getTotalVideoTime(directoryPath);
const totalDuration = new Date(totalSeconds * 1000).toISOString().substr(11, 8);
console.log(`Total video duration in ${directoryPath}: ${totalDuration}`);
