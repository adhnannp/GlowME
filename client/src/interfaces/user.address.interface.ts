export default interface IUserAddress {
  _id?: string;
  user_id?: string;
  name: string;
  phone: string;
  pincode: string;
  landmark?: string;
  state: string;
  country: string;
  address: string;
  created_at?: string;
  edited_at?: string;
}
