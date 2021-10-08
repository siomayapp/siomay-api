export interface UpdateUserDto {
  name: string;
  role: string;
  username: string;
  phone: string;
  address: string;
  avatar: string;
  modifiedBy: string;
  isActive: boolean | undefined;
}
