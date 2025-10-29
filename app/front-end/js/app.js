import { API_BASE_URL } from "./config.js";

import { initUserFunctions } from "./user.js";
import { initMemberFunctions } from "./member.js";
import { initMemberTypeFunctions } from "./member_type.js";
import { initLoginFunctions } from "./login.js";

initUserFunctions();
initMemberFunctions();
initMemberTypeFunctions();
initLoginFunctions();


