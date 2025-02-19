// https://www.nearlyfreespeech.net/services/hosting
// https://www.nearlyfreespeech.net/estimate

// Edit these consts

const ACTIVE_CLIENTS = 10_000
const TOTAL_DAYS_OF_HOSTING = 10
const CANVAS_ROWS = 50
const CANVAS_COLUMNS = 50
const TOTAL_PAINT_EVENTS = 100_000

// Shared Consts
const BYTES_PER_CHAR = 2
const TYPICAL_PAINT_RECORD_BYTES = '12_34,a'.length * BYTES_PER_CHAR
const BYTE_TO_GIGABYTE = 1 / 1024 / 1024 / 1024


// *************************************************************************************************************************************
// *************************************************************************************************************************************
// *************************************************************************************************************************************
// *** Base Charge *********************************************************************************************************************
console.log('Base Charge')
// *************************************************************************************************************************************
// *************************************************************************************************************************************
// *************************************************************************************************************************************

const baseCharge = TOTAL_DAYS_OF_HOSTING * 0.01
console.log(`\tHosting for ${TOTAL_DAYS_OF_HOSTING} days: $${baseCharge}`)

// *************************************************************************************************************************************
// *************************************************************************************************************************************
// *************************************************************************************************************************************
// *** Memory **************************************************************************************************************************
console.log('Resources')
// *************************************************************************************************************************************
// *************************************************************************************************************************************
// *************************************************************************************************************************************

let memoryCharge = 0

// *** Connections *********************************************************************************************************************

const TYPICAL_UUID_BYTES = 'a375562a-3850-4757-b5e3-c751b1fca0c4'.length * BYTES_PER_CHAR

/** From ChatGPT
 * The object { write: (data: string) => client.write(data) } includes:
A function reference (write): Function overhead in V8 depends on context, but a typical function is a few dozen bytes (estimate ~64B).
The Express Response object reference:
This is the biggest unknown since Express Response objects contain a lot of internal state.
A rough estimate: ~1 KB – 10 KB, depending on request headers, response state, etc. */
const EXPRESS_RESPONSE_OBJECT_BYTES = 5_000

const clientBytes = (TYPICAL_UUID_BYTES + EXPRESS_RESPONSE_OBJECT_BYTES) * ACTIVE_CLIENTS
console.log(`\tMemory for ${ACTIVE_CLIENTS} clients: ${clientBytes / 1024}kb`)

// *** Canvas  *************************************************************************************************************************

const paintBytes =  TYPICAL_PAINT_RECORD_BYTES * CANVAS_COLUMNS * CANVAS_ROWS
console.log(`\tMemory for storing canvas: ${paintBytes / 1024 }kb`)

// *** Cost ****************************************************************************************************************************
const totalMemoryGigabytes = (paintBytes + clientBytes) / 1024 / 1024 / 1024
const MINUTES_IN_A_MONTH = 30 * 24 * 60
console.log(`\tTotal Memory: ${totalMemoryGigabytes}gb`)
const totalRAUs = totalMemoryGigabytes * MINUTES_IN_A_MONTH
console.log(`\tTotal RAUs: ${totalRAUs}`)
const resourcesCost = totalRAUs / 44.64  * 0.01 // https://www.nearlyfreespeech.net/services/hosting
console.log(`\tMonthly Cost: ${resourcesCost}`)

// *************************************************************************************************************************************
// *** Bandwidth ***********************************************************************************************************************
console.log("Bandwidth (Included)")
// *************************************************************************************************************************************

//  - 1 GiB/day (Free after 1 GiB)
//  - Uses - Sending messages, posts, gets

const initMessage = TYPICAL_PAINT_RECORD_BYTES * CANVAS_COLUMNS * CANVAS_ROWS
const allInitMessagesGB = initMessage * ACTIVE_CLIENTS / 1024 / 1024 / 1024

const AVERAGE_MESSAGE_BYTES = TYPICAL_PAINT_RECORD_BYTES * 25 // Batch 5 paint events, of 5 paints.
const averageMessageBytes = AVERAGE_MESSAGE_BYTES + ACTIVE_CLIENTS
const messagesGB = averageMessageBytes * TOTAL_PAINT_EVENTS / 1024 / 1024 / 1024

console.log(`\tTotal bandwidth ${messagesGB + allInitMessagesGB}gb`)


// *************************************************************************************************************************************
// *** Storage *************************************************************************************************************************
console.log('Storage')
// *************************************************************************************************************************************

// $1.00 / GiB-month
const baseMessageBytes = '2025-02-02T20:20:19.719Z 82030e63-5c6e-4574-810d-426c54e01bd2: '.length * BYTES_PER_CHAR
const paintEvent = TYPICAL_PAINT_RECORD_BYTES * 5

const storageGB = (baseMessageBytes + paintEvent) * TOTAL_PAINT_EVENTS / 1024 / 1024 /1024
const storageCost = storageGB * 1

console.log(`\tTotal storage ${storageGB}gb gives cost of $${storageCost}`)

// *************************************************************************************************************************************
// *** Total Cost *************************************************************************************************************************
console.log('Total Cost')
// *************************************************************************************************************************************


const total = baseCharge + resourcesCost + storageCost
console.log(total)



