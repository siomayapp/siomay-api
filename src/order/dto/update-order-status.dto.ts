import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderStatusDto extends PartialType(CreateOrderDto) {}

// {
//   "variants": [
//       {
//           "variant": 1,
//           "amount": 5,
//           "isPicked": true,
//           "pickedAmount": 5,
//           "pickedFrom": [
//             {
//               "storage": "Box 1",
//               "pickedAmount": 5,
//             }
//           ],
//       },
//       {
//           "variant": 2,
//           "amount": 5,
//           "isPicked": true,
//           "pickedAmount": 5,
//           "pickedFrom": [
//             {
//               "storage": "Box 6",
//               "pickedAmount": 1,
//             },
//             {
//               "storage": "Box 9",
//               "pickedAmount": 2,
//             },
//             {
//               "storage": "Box 10",
//               "pickedAmount": 1,
//             },
//             {
//               "storage": "Box 11",
//               "pickedAmount": 1,
//             }
//           ]
//       }
//   ],
//   "statuses": [
//       {
//           "status": "incoming",
//           "statusDate": "2021-11-24 19:33:00",
//           "actor": "eriawan",
//           "note": null
//       },
//       {
//           "status": "processing",
//           "statusDate": "2021-11-25 19:33:00",
//           "actor": "eriawan",
//           "note": null
//       }
//   ]
// }
