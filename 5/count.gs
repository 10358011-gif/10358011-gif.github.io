function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("網頁計數器");
}

function getCount() {
  return readCount_();
}

function incrementCount() {
  return updateCount_(1);
}

function decrementCount() {
  return updateCount_(-1);
}

function resetCount() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    PropertiesService.getScriptProperties().setProperty("count", "0");
    return 0;
  } finally {
    lock.releaseLock();
  }
}

function readCount_() {
  const value = PropertiesService.getScriptProperties().getProperty("count");
  if (value === null) return 0;

  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error("計數資料格式錯誤，請重設計數器。");
  }
  return count;
}

function updateCount_(amount) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const count = readCount_();
    const nextCount = Math.max(0, count + amount);
    if (!Number.isSafeInteger(nextCount)) {
      throw new Error("計數已達上限，無法繼續增加。");
    }

    PropertiesService.getScriptProperties().setProperty("count", String(nextCount));
    return nextCount;
  } finally {
    lock.releaseLock();
  }
}
