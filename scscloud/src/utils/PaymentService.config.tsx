import {load} from '@cashfreepayments/cashfree-js';
export let cashfree= load({
		mode: "production"
	});

async function init(){
	cashfree=await load({
		mode: "production"
	});
}
init();