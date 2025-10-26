import { Cashfree } from "cashfree-pg"; 
import 'dotenv/config'

Cashfree.XClientId = process.env.CASHFREE_APP_KEY!;
Cashfree.XClientSecret = process.env.CASHFREE_APP_SECRET_KEY!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Use PRODUCTION for live environment

export default Cashfree;