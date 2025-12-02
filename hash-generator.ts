const bcrypt = require("bcrypt");
const hash = await bcrypt.hash("20NPC25", 10);
console.log(await bcrypt.compare("20NPC25", hash));
