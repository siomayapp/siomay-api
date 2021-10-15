import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StorageTransactionService } from './storage-transaction.service';
import { CreateStorageTransactionDto } from './dto/create-storage-transaction.dto';

@Controller('storage-transaction')
export class StorageTransactionController {
  constructor(
    private readonly storageTransactionService: StorageTransactionService,
  ) {}

  // @Post()
  // create(@Body() createStorageTransactionDto: CreateStorageTransactionDto) {
  //   return this.storageTransactionService.create(createStorageTransactionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.storageTransactionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.storageTransactionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateStorageTransactionDto: UpdateStorageTransactionDto,
  // ) {
  //   return this.storageTransactionService.update(
  //     +id,
  //     updateStorageTransactionDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.storageTransactionService.remove(+id);
  // }
}
