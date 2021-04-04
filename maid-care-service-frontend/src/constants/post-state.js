// creating posted matched confirmed done reviewed canceled
export const CREATING = 'creating'; // Creating a Post, Filling Detail, [Post still not be created]
export const POSTED = 'posted'; // Job is Post to the system and getting match...
export const MATCHED = 'matched'; // Maid accepted, wait for Confirmation from Customer
export const CONFIRMED = 'confirmed'; // Customer confirmed, Job completely in progress...
export const DONE = 'done'; // Maid confirm that job is done, wait customer to confirm and reviewed
export const REVIEWED = 'reviewed'; // Customer reviewed
export const CANCELED = 'canceled'; // Job is canceled ny Maid
