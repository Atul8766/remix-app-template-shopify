import { createRequestHandler } from "@remix-run/vercel";
import * as build from "../build/index.js"; // Path to the build output

export default createRequestHandler({ build });
