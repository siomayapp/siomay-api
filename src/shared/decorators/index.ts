import {
  applyDecorators,
  HttpException,
  HttpStatus,
  SetMetadata,
  UseInterceptors,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserRole } from '../../users/entities/users.role.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'role';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const ApiFile = ({
  fieldName = 'file',
  destination = 'public/uploads',
  allowedTypes = [],
}) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: destination,
          filename: (req, file, cb) => {
            if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
              const err = new HttpException(
                'File type not allowed',
                HttpStatus.BAD_REQUEST,
              );
              cb(err, null);
            } else {
              cb(null, file.originalname);
            }
          },
        }),
      }),
    ),
  );
};

export const Pagination = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return { last: req.query.last, limit: req.query.limit };
  },
);

export const Filter = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  delete req.query.last;
  delete req.query.limit;
  return req.query;
});
